# FROM node:20-alpine AS frontend  
# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# WORKDIR /home/node/app 
# COPY ./frontend/package*.json ./  
# USER node
# RUN npm ci  
# COPY --chown=node:node ./frontend/ ./frontend  
# COPY --chown=node:node ./static/ ./static  
# WORKDIR /home/node/app/frontend
# RUN npm run build
  
# FROM python:3.11-alpine 
  
# COPY requirements.txt /usr/src/app/  
# RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt \
# COPY . /usr/src/app/  
# COPY --from=frontend /home/node/app/static  /usr/src/app/static/
# WORKDIR /usr/src/app  
# EXPOSE 80  
# CMD ["gunicorn", "--http", ":80", "--wsgi-file", "app.py", "--callable", "app", "-b","32768"]




FROM node:14 AS build
 
WORKDIR /app
 
COPY frontend/package*.json ./
 
RUN npm install
 
COPY frontend ./
 
RUN npm run build
 
FROM nginx:alpine
 
COPY --from=build /app/build /usr/share/nginx/html
 
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
