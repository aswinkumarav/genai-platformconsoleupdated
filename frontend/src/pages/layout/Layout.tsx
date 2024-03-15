import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import logo from "../../assets/nucleus.png";
import { CopyRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField, ICommandBarStyles, IButtonStyles } from "@fluentui/react";
import { useContext, useEffect, useState, useRef } from "react";
import { HistoryButton, ShareButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus, getFolderInfo } from "../../api";
import info from "../../assets/icon/info-square.svg"
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { IoCloseOutline } from "react-icons/io5";
import { FaRegFolder } from "react-icons/fa6";
import { CiFolderOn } from "react-icons/ci";
import { AiOutlineFileProtect } from "react-icons/ai";
import { FiLink } from "react-icons/fi";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
    root: {
      width: 86,
      height: 32,
      borderRadius: 4,
      background: 'rgb(255, 255, 255) !important',
    //   position: 'absolute',
    //   right: 20,
      padding: '5px 12px',
      marginRight: '20px'
    },
    icon: {
      color: '#000',
    },
    rootHovered: {
      background: 'rgb(255, 255, 255) !important',
    },
    label: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '20px',
      color: '#000',
    },
  };

const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const appStateContext = useContext(AppStateContext)
    const [folderList, setFolderList] = useState<any>('');
    const [folderKey, setFolderKey] = useState<any>('');
    const [showFolderList, setShowFolderList] = useState<boolean>(false);
    const ref = useRef(null);
    const [target, setTarget] = useState(null);
    const [showLink, setShowLink] = useState(false);

    const handleShareClick = () => {
        setIsSharePanelOpen(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    const intFolderInfo = () => {
        getFolderInfo().then((response: any) => {
            const keys: any = Object.keys(response);
            if (!folderList) {
                setFolderList(response);
                setFolderKey(keys);
            }
        })
    }

    const handleClick = (event: any) => {
        setShowFolderList(!showFolderList);
        setTarget(event.target);
      };

    const handleShowLink = () => {
        setShowLink(!showLink)
    }

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    // useEffect(() => { intFolderInfo() }, []);
    useEffect(() => {}, [appStateContext?.state.isCosmosDBAvailable.status]);

    return (
        <div className={styles.layout}>
            <div className={styles.parentHeader}>
                <header className={styles.header} role={"banner"}>
                    <Stack horizontal verticalAlign="center" horizontalAlign="space-between"
                    // className={styles.headerContainer}
                    >
                        <Stack horizontal verticalAlign="center" className={styles.logo}>
                            <Link to="/">
                                <img
                                    src={logo}
                                    className={styles.headerIcon}
                                />
                            </Link>
                            <span className={styles.productName}>Nucleus Gen AI</span>
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 4 }}>
                        {/* <Dropdown show={showLink ? true : false} style={{marginTop: '2px'}}>
                            <span className={styles.falink} onClick={() => handleShowLink()}>
                                <FiLink size={'22px'}/>
                            </span>

                            <Dropdown.Menu show={showLink} style={{top: '35px'}}>
                                <Dropdown.Item target="_blank" href="https://oai.azure.com/portal/5d7820a3bbcd4eada713d4b1a80b723e/chat?tenantid=74b72ba8-5684-402c-98da-e38799398d7d">Studio</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> */}
                        { folderKey && folderKey.length && folderList ? (
                                <span ref={ref} style={{margin: '4px 3px'}}>
                                    <span onClick={handleClick} style={{cursor: 'pointer'}}>
                                        <img
                                            src={info}
                                            alt="user"
                                            id="user-icon"
                                            height={23}
                                            width={23}
                                        />
                                    </span>
                                        <Overlay placement="bottom" container={ref} rootClose={true} show={showFolderList} target={target}>
                                            <Popover id="popover-contained" className={styles.popoverContainer}>
                                                <Popover.Header as="h3" style={{
                                                    borderBottom: '1.5px solid #b4b4b4',
                                                    paddingBottom: '8px',
                                                    marginTop: '10px'
                                                    }}>Folder List
                                                    <span onClick={() => {setShowFolderList(false)}} className={styles.folderListClose}><IoCloseOutline /></span>
                                                    </Popover.Header>
                                                    
                                                <Popover.Body>
                                                    { folderKey && folderKey.length ? (
                                                        folderKey.map((key: string) => (
                                                            <>
                                                                <div style={{marginTop: '5px'}}>
                                                                    <div style={{display: 'flex', fontWeight: '500'}}>
                                                                        <span style={{marginTop: '2px'}}><FaRegFolder size={17}/></span>
                                                                        <span style={{fontSize: '15px', marginLeft: '7px'}}>{key}</span>
                                                                    </div>
                                                                    {folderList[key].map((list: string) => (
                                                                        <div style={{display: 'flex', marginLeft: '25px'}}>
                                                                            <span style={{marginTop: '2px'}}><CiFolderOn size={18}/></span>
                                                                            <span style={{fontSize: '15px', marginLeft: '5px'}}>{list}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ))
                                                        ) : (
                                                            <>Loading folder list...</>
                                                        )
                                                    }
                                                </Popover.Body>
                                            </Popover>
                                        </Overlay>
                                </span> ) : (<></>) }
                                {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) && 
                                    <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? "Hide chat history" : "Show chat history"}/>    
                                }
                                <ShareButton onClick={handleShareClick} />
                                {/* <Link style={{marginLeft: '0px'}} to="https://web.yammer.com/main/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIxNzU5NDE3MTM5MjAifQ" target="_blank">
                                    <button className={styles.protectBtn}>
                                        <span className={styles.protected}>
                                            <span>Help Forum</span>
                                        </span>
                                    </button>
                                </Link>
                                <button className={styles.protectBtn} style={{marginRight: '10px'}}>
                                    <span className={styles.protected}>
                                        <span style={{marginTop: '-1px'}}><AiOutlineFileProtect/></span>
                                        <span style={{marginLeft: '5px'}}>Protected</span>
                                    </span>
                                </button> */}
                        </Stack>

                    </Stack>
                </header>
            </div>
            <Outlet />
            <Dialog 
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{
                    
                    main: [{
                        selectors: {
                          ['@media (min-width: 480px)']: {
                            maxWidth: '600px',
                            background: "#FFFFFF",
                            boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                            borderRadius: "8px",
                            maxHeight: '200px',
                            minHeight: '100px',
                          }
                        }
                      }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{gap: "8px"}}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly/>
                    <div 
                        className={styles.copyButtonContainer} 
                        role="button" 
                        tabIndex={0} 
                        aria-label="Copy" 
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
        </div>
    );
};


export default Layout;
