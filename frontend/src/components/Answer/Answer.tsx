import { useEffect, useMemo, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks"
import { FontIcon, Stack, Text } from "@fluentui/react";

import styles from "./Answer.module.css";

import { AskResponse, Citation } from "../../api";
import { parseAnswer } from "./AnswerParser";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import supersub from 'remark-supersub'
import { BsFolderSymlink } from "react-icons/bs";
import { FaRegFilePdf } from "react-icons/fa6";

interface Props {
    answer: AskResponse;
    onCitationClicked: (citedDocument: Citation) => void;
}

export const Answer = ({
    answer,
    onCitationClicked
}: Props) => {
    const [isRefAccordionOpen, { toggle: toggleIsRefAccordionOpen }] = useBoolean(false);
    const filePathTruncationLimit = 50;

    const parsedAnswer = useMemo(() => parseAnswer(answer), [answer]);
    const [chevronIsExpanded, setChevronIsExpanded] = useState(isRefAccordionOpen);
    console.log(parsedAnswer);
    const handleChevronClick = () => {
        setChevronIsExpanded(!chevronIsExpanded);
        toggleIsRefAccordionOpen();
      };

    useEffect(() => {
        setChevronIsExpanded(isRefAccordionOpen);
    }, [isRefAccordionOpen]);

    const onFolderClicked = (data: Citation) => {
        const dataUrl = data.url;
        const fileUrl = dataUrl?.replace(" ", "%20");
        window.open(fileUrl, '_blank');
    }

    const openCitationPanel = (citation: Citation, showPdf = false) => {
        citation.showPdf = showPdf;
        onCitationClicked(citation)
    }

    const createCitationFilepath = (citation: Citation, index: number, truncate: boolean = false) => {
        let citationFilename = "";
        let citationFilePath = citation.filepath;
        if (citationFilePath && citationFilePath.indexOf('OneDrive') >= 0) {
            const citationFilenameArr = citationFilePath.split('/');
            citationFilenameArr.splice(0, 1);
            citationFilePath = '';
            citationFilenameArr.forEach((path: string, i: number) => {
                if(i > 0) {
                    citationFilePath = citationFilePath + '/';
                }
                citationFilePath = citationFilePath + path;
            })
        }

        if (citationFilePath && citation.chunk_id) {
            const citationFilePathArr = citationFilePath.split('.');
            citation.ext = citationFilePathArr[citationFilePathArr.length - 1];
            if (truncate && citationFilePath.length > filePathTruncationLimit) {
                const citationLength = citationFilePath.length;
                citationFilename = `${citationFilePath.substring(0, 20)}...${citationFilePath.substring(citationLength -20)} - Part ${parseInt(citation.chunk_id) + 1}`;
            }
            else {
                citationFilename = `${citationFilePath} - Part ${parseInt(citation.chunk_id) + 1}`;
            }
        }
        else if (citationFilePath && citation.reindex_id) {
            citationFilename = `${citationFilePath} - Part ${citation.reindex_id}`;
        }
        else {
            citationFilename = `Citation ${index}`;
        }

        
        return citationFilename;
    }

    return (
        <>
            <Stack className={styles.answerContainer} tabIndex={0}>
                <Stack.Item grow>
                    <ReactMarkdown
                        linkTarget="_blank"
                        remarkPlugins={[remarkGfm, supersub]}
                        children={parsedAnswer.markdownFormatText}
                        className={styles.answerText}
                    />
                </Stack.Item>
                <Stack horizontal className={styles.answerFooter}>
                {!!parsedAnswer.citations.length && (
                    <Stack.Item
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? toggleIsRefAccordionOpen() : null}
                    >
                        <Stack style={{width: "100%"}} >
                            <Stack horizontal horizontalAlign='start' verticalAlign='center'>
                                <Text
                                    className={styles.accordionTitle}
                                    onClick={toggleIsRefAccordionOpen}
                                    aria-label="Open references"
                                    tabIndex={0}
                                    role="button"
                                >
                                <span>{parsedAnswer.citations.length > 1 ? parsedAnswer.citations.length + " references" : "1 reference"}</span>
                                </Text>
                                <FontIcon className={styles.accordionIcon}
                                onClick={handleChevronClick} iconName={chevronIsExpanded ? 'ChevronDown' : 'ChevronRight'}
                                />
                            </Stack>
                            
                        </Stack>
                    </Stack.Item>
                )}
                <Stack.Item className={styles.answerDisclaimerContainer}>
                    <span className={styles.answerDisclaimer}>AI-generated content may be incorrect</span>
                </Stack.Item>
                </Stack>
                {chevronIsExpanded && 
                    <div style={{ marginTop: 8, display: "flex", flexFlow: "wrap column", maxHeight: "150px", gap: "4px" }}>
                        {parsedAnswer.citations.map((citation, idx) => {
                            return (
                                <>
                                    <span 
                                        title={createCitationFilepath(citation, ++idx)} 
                                        tabIndex={0} 
                                        role="link" 
                                        key={idx} 
                                        className={styles.citationContainer}
                                        aria-label={createCitationFilepath(citation, idx)}
                                    >
                                        <span className={styles.citationLink} onClick={() => openCitationPanel(citation, false)}>
                                            <div className={styles.citation}>{idx}</div>
                                            {createCitationFilepath(citation, idx, true)}
                                        </span>
                                        
                                        {citation.ext === 'pdf' ? (
                                            <span title="Open PDF" className={styles.fileUrl} onClick={() => openCitationPanel(citation, true)} ><FaRegFilePdf /></span>
                                        ) : (<></>)}
                                        <span title="Click to open share point" className={styles.fileUrl} onClick={() => onFolderClicked(citation)} ><BsFolderSymlink /></span>
                                    </span>
                                </>
                                );
                        })}
                    </div>
                }
            </Stack>
        </>
    );
};
