## How To Install
1. in terminal in both client and backend do
```
npm install
```
2. in .env.temp delete .temp and add SKEY aka secretkey for jwt key and add some webhookurl for logs
3. do in client 
```
npm build 
```
and then 
```
serve -s build 
```
if give error no server then do 
```
npm install serve -g
```
4. enjoy