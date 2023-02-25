const fs=require('fs');
// load .env confoguration
require('dotenv').config()

fs.watch('log.txt',(curr, prev) => {
    console.log("\nThe file was edited");
  
    // Show the time when the file was modified
    console.log("Previous Modified Time", prev.mtime);
    console.log("Current Modified Time", curr.mtime);

    fs.readFile(process.env.LOGFILEPATH,{encoding: 'utf-8'}, (err, data) => {
        let lastLine = data.trim().split('\n')[data.trim().split('\n').length - 1];
        if(lastLine.includes('connected')) {
            console.log(cleanUpLine(lastLine));
            
        }
     })
  });

function cleanUpLine(lastLine){
    return lastLine.slice(lastLine.indexOf('connected:') + 11,lastLine.indexOf("xuid")-2);
}
  