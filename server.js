
import line from '@line/bot-sdk';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { Storage } from '@google-cloud/storage';
import {Datastore} from '@google-cloud/datastore';
import { format } from 'path';
import muscleRelaxation from './intervantion/muscleRelaxation.js'
import relaxation  from './intervantion/relaxation.js';
import deepSlowBreathing from './intervantion/deepSlowBreathing.js';
import {cognitivePattern1, cognitivePattern2, cognitivePattern3} from './intervantion/cognitive.js'
import {anxietyModelPattern1, anxietyModelPattern2, anxietyModelPattern3} from './intervantion/anxietyModel.js'
import activitiesScgedulingFunc from './intervantion/activitiesScheduling.js'
import activitiesSchedulingTwo from './intervantion/activitiesSchedulingTwo.js'
import relaxationTwo from './intervantion/relaxationTwo.js'
import notificationMoodActivity from './intervantion/notificationMoodActivity.js' 

import openCam from './ricemenufunction/openCam.js'
import testsinglog from './ricemenufunction/testsinglog.js'
// import faqMsg from './ricemenufunction/faqMsg.js'

const app = express();
const port = process.env.PORT || 5500;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const user = process.env.CLOUD_SQL_USERNAME
const pass = process.env.CLOUD_SQL_PASSWORD
const db = process.env.CLOUD_SQL_DATABASE_NAME
const socketPath = process.env.CLOUD_SQL_CONNECTION_NAME
const connection = process.env.CLOUD_SQL_CONNECTION_HOST
// const bucket = store.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const gCloud = new Storage({
  keyFilename: './testdeploy-330007-cfc853e977b1.json',
  projectId: 'testdeploy-330007'
});

const bucket = gCloud.bucket('scg_storage');

const datastore = new Datastore();


// create LINE SDK config from env variables
const config = {
  // channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  // channelSecret: process.env.CHANNEL_SECRET,

  //  MySleeplezz 
  channelAccessToken: 'UG1DCQe0wQvks4ba3LGXIbRzzaDkD2Tljv8+yvosfoMEyQa7mkIap06rMbbDrgNjtsVOlEmNpMdcmm9b7ibREvQzresLTnXOnehsClq0cVFvAUO2qYGK0LIr1c2Ava/BRMHYfFvB4DuZRQVH2rjyfgdB04t89/1O/w1cDnyilFU=',
  channelSecret: '2d77e494b5df69802310eb1f1d1a933b'
};
 
// create LINE SDK client
const client = new line.Client(config);


app.post('/callback', async (request, response) => {
  console.log('Start....')
  let jsonfile = request.body; 
  let msgID = request.body.events[0].message.id;
  let userID = request.body.events[0].source.userId;
  let msgType = request.body.events[0].message.type;
  let msgText = request.body.events[0].message.text;
  let token = request.body.events[0].replyToken;
  console.log("start ===>",jsonfile)
 
  if(msgType === "text")
  {

    // if(msgText === "FAQ"){
    //   const msgReply = faqMsg();
    //   const echo = { type: 'flex', altText: 'This is a Flex Message', contents: msgReply };
    //   return client.replyMessage(token, echo);
    // }
    // for dev // 
    if(msgText === "!debugerTester!"){

      const debugMsg = relaxation();
      const msgDeploy = {
        type: "template",
        altText: "This is test msg!",
        template: debugMsg
      }

      console.log("debuger-tester")
      return client.pushMessage(userID, msgDeploy)
   
    } 
    else if(msgText.includes("--") === true)
    {
      const arraySplitWord = msgText.split('--');
      const lengthOfArrary = arraySplitWord.length; 

      if(lengthOfArrary === 2)
      {
          const arrayWord = msgText.split('--');
          const firstName = arrayWord[0];
          const lastName = arrayWord[1];
          if(firstName === undefined || lastName === undefined)
          {
            // console.log("Error format insert!");
            const replyMsg = {type: 'text', text: "กรุณาตรวจสอบรูปแแบบการบันทึกข้อความให้อยู่ในรูปแบบ ชื่อ-นามสกุล"};
            // conn.end();
            return client.replyMessage(token, replyMsg);
          }
          else
          {
            addFireStorage(userID, firstName, lastName);

            const msgReply = "ได้รับข้อมูลเเล้วคะ"
            const echo = { type: 'text', text:msgReply};
            return client.replyMessage(token, echo);   
          }
      }
      else
      {
        const replyMsg = {type: 'text', text: "กรุณาตรวจสอบรูปแบบการบันทึกให้อยู่ในรูปแบบ ชื่อ-นามสกุล"};
        // conn.end();
        return client.replyMessage(token, replyMsg);     
      }
    }
    else if(msgText === "ตอบเเบบสอบถามความรุนเเรงเสร็จสิ้น"){
      const msgConfirm = "สวัสดีคะ ขอต้อนรับเข้าสู่ My Sleeplezz\n\nเพื่อร่วมออกแบบ Solution การนอนหลับที่ดีไปด้วยกัน เราจะเริ่มมาทำความรู้จักกับบริบทรอบ ๆ ตัวคุณในแต่ละวัน ซึ่งทางทีมงานจะส่ง Sleepy box ไปให้คุณถึงบ้าน เมื่อเปิดกล่องคุณจะพบกับ Device ซึ่งเป็นอุปกรณ์ในการทำความเข้าใจรูปแบบการนอนและคำแนะนำเพื่อร่วมเปิดประสบการณ์ใหม่ไปด้วยกัน โดยเราจะร่วมใช้ Device ไปพร้อม ๆ กันตั้งแต่วันที่ 15 พ.ย.-26 พ.ย.64 \nในแต่ละสัปดาห์ทางทีมงานจะประมวลผลข้อมูลการนอนในการใช้ชีวิตประจำวันของคุณให้ทราบผ่านทาง Line OA นี้ค่ะ \nเมื่อพอทราบรูปแบบการใช้ชีวิตและการนอนการคุณแล้วทางทีมทางจะเชิญคุณเข้าร่วมออกแบบ Solution ที่เฉพาะตัว อีกครั้งนะคะ \n\nก่อนอื่นรบกวนตอบแบบสอบถามเพื่อเติมดังนี้ค่ะ https://forms.gle/JS7zY9NdaQUtzUyi8";
      const replyConfirm = {type: 'text', text: msgConfirm};
      return client.replyMessage(token, replyConfirm);
    }
  
    else if (msgText === 'Dashboard') {
      // console.log('Dashboard-->', userID);
      const msgReply = testsinglog(userID);
      const echo = { type: 'flex', altText: 'Dashboard', contents: msgReply };
      return client.replyMessage(token, echo);
    }
    else if (msgText === "คำถามใน Thinking Log เพื่ออัด VDO") {
      const replyFlexOpenCam = openCam()
      const echo = { type: 'flex', altText: 'เปิดกล้อง', contents: replyFlexOpenCam }
      return client.replyMessage(token, echo);
    }
    else if(msgText === "ดำเนินการ Muscle relaxation"){
      const msgReply = muscleRelaxation()
      const echo = {type: 'flex', altText: 'Muscle relaxation', contents: msgReply}
      return client.replyMessage(token, echo);
    }
    else if(msgText === "ดำเนินการ Deep slow breathing"){
      const msgReply = deepSlowBreathing()
      const echo = {type: 'flex', altText: 'Deep slow breathing', contents:msgReply}
      return client.replyMessage(token, echo)
    }
    else if(msgText === "รายละเอียด Muscle relaxation"){
      const msgReply = "เพื่อการนอนหลับที่ผ่อนคลายในคืนนี้ เรามาผ่อนคลายกล้ามเนื้อกันนะคะ วิธีนี้เรียกว่า Progressive Muscle Relaxation คิดค้นโดยนายแพทย์ Edmund Jacobson ชาวอเมริกัน โดยใช้หลักการตั้งใจเกร็งกลุ่มกล้ามเนื้อมัดใหญ่ แล้วค่อยๆ ผ่อนคลายให้สอดคล้องกับการหายใจ เพื่อเป็นการลดสารแห่งความเครียด  ทำให้จิตใจสงบปล่อยวางความคิด ลดปฏิกริยาของร่างกายที่ตอบสนองต่อความเครียด ความกังวล ทำให้คุณภาพการนอนหลับดีขึ้นค่ะ  เรามาทำพร้อมๆ กันตาม clip ที่แนะนำได้เลยนะคะ และถ้าหากต้องการเสียงเพลงประกอบเพื่อการผ่อนคลายสามารถ click เลือกเพลงด้านล่างได้เลยค่ะ"
      const echo = {type: 'text', text:msgReply}
      return client.replyMessage(token, echo)
    }
    else if(msgText === "รายละเอียด Deep slow breathing"){
      const msgReply = "การหายใจเข้าออกลึก ๆ จะทำให้เราหลับสบายขึ้นค่ะ เพราะจะช่วยลดความดันโลหิตได้ด้วยการทำให้กล้ามเนื้อผ่อนคลาย เพิ่มการหมุนเวียนเลือด และควบคุมการเต้นของหัวใจให้เป็นปกติ ทำได้ง่ายและสร้างสมาธิได้ด้วย  เรามาทำพร้อมๆ กันตาม clip ที่แนะนำได้เลยนะคะ และถ้าหากต้องการเสียงเพลงประกอบเพื่อการผ่อนคลายสามารถ click เลือกเพลงด้านล่างได้เลยค่ะ"
      const echo = {type:'text', text: msgReply}
      return client.replyMessage(token, echo)
    }
    else if(msgText === "รายละเอียด Savoring"){
      const msgReply = "การนึกถึงเรื่องราวที่เกิดขึ้นระหว่างวันเป็นการทบทวนสิ่งที่เกิดขึ้นจะช่วยให้เชื่อมโยงเหตุการณ์ต่างๆ ที่เราสามารถเรียนรู้และปรับตัวได้ เป็นปัจจัยหนึ่งที่ทำให้เรามีความสุขกับชีวิตในความเป็นจริงค่ะ  เราลองมานึกถึงเรื่องราวในวันนี้พร้อมกันนะคะ"
      const echo = {type: 'text', text:msgReply}
      return client.replyMessage(token, echo)
    }
    else if(msgText === "Muscle relax"){
      const setDate = new Date();
      const isDate = setDate.getFullYear()+"/"+(setDate.getMonth() + 1)+"/"+setDate.getDate()+" "+(setDate.getHours()+7)+":" + setDate.getMinutes()+":"+setDate.getSeconds()

      const checkingData = datastore.createQuery("user_runninig_menu")
      .filter('userid', '=', userID)
      .order('id_log',{
        descending: true
      })
      .limit(1)
      const [tasks] = await datastore.runQuery(checkingData)
 
      let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
      const logId = setLogId
      
      const kind = "user_runninig_menu"
      const taskKey = datastore.key([kind]);
      const task = {
        key: taskKey,
        data: {
          id_log: logId,
          menu_selection: msgText,
          running_number: 0,
          user_reply: msgText,
          userid: userID,
          status: false,
          createdate: isDate}
        }
      
      await datastore.save(task)
 

      const msgReply = "Clip สาธิตการทำ Progressive Muscle Relaxation \n https://drive.google.com/file/d/1igBYZ9jknJhYmbbjdgMTX7AwaZnYH7OO/view?usp=sharing \n \n**หลังจากที่ผ่อนคลายแล้ว รู้สึกอย่างไรบ้าง อย่าลืมพิมพ์มาให้เรารู้ด้วยนะ**"
      const echo ={type:'text', text: msgReply}
      return client.replyMessage(token, echo)
    }
    else if(msgText === "breathing Video"){
      const setDate = new Date();
      const isDate = setDate.getFullYear()+"/"+(setDate.getMonth() + 1)+"/"+setDate.getDate()+" "+(setDate.getHours()+7)+":" + setDate.getMinutes()+":"+setDate.getSeconds()

      const checkingData = datastore.createQuery("user_runninig_menu")
      .filter('userid', '=', userID)
      .order('id_log',{
        descending: true
      })
      .limit(1)
      const [tasks] = await datastore.runQuery(checkingData)
 
      let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
      const logId = setLogId
      
      const kind = "user_runninig_menu"
      const taskKey = datastore.key([kind]);
      const task = {
        key: taskKey,
        data: {
          id_log: logId,
          menu_selection: msgText,
          running_number: 0,
          user_reply: msgText,
          userid: userID,
          status: false,
          createdate: isDate}
        }
      
      await datastore.save(task)

      const msgReply = "Clip สาธิตการทำ deep-slow breathing \n https://drive.google.com/file/d/1hKHeB-V8MaER-dK6TW2K2XiVix5F6wIh/view?usp=sharing \n \n**หลังจากที่ผ่อนคลายแล้ว รู้สึกอย่างไรบ้าง อย่าลืมพิมพ์มาให้เรารู้ด้วยนะ**"
      const echo = {type:'text', text: msgReply}
      return client.replyMessage(token, echo)
    }
    else if(msgText === "Music Relax"){
      const setDate = new Date();
      const isDate = setDate.getFullYear()+"/"+(setDate.getMonth() + 1)+"/"+setDate.getDate()+" "+(setDate.getHours()+7)+":" + setDate.getMinutes()+":"+setDate.getSeconds()

      const checkingData = datastore.createQuery("user_runninig_menu")
      .filter('userid', '=', userID)
      .order('id_log',{
        descending: true
      })
      .limit(1)
      const [tasks] = await datastore.runQuery(checkingData)
 
      let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
      const logId = setLogId
      
      const kind = "user_runninig_menu"
      const taskKey = datastore.key([kind]);
      const task = {
        key: taskKey,
        data: {
          id_log: logId,
          menu_selection: msgText,
          running_number: 0,
          user_reply: msgText,
          userid: userID,
          status: false,
          createdate: isDate}
        }
      
      await datastore.save(task)

      const msgReply = "กรุณาเลือกเพลงได้ตามลิงก์ได้เลยคะ:\n 1.White Noise: https://www.youtube.com/watch?v=tjMOiabqK7A \n 2.Forest https://www.youtube.com/watch?v=1ZYbU82GVz4 \n 3.Music https://www.youtube.com/watch?v=hlWiI4xVXKY \n 4.Sea https://www.youtube.com/watch?v=PgkvwG971hw \n **หลังจากที่ผ่อนคลายแล้ว รู้สึกอย่างไรบ้าง อย่าลืมพิมพ์มาให้เรารู้ด้วยนะ**"
      const echo = {type: 'text', text: msgReply}
      return client.replyMessage(token, echo)
    }


    //  *************************  // 
    //  !! start intervention !!  // 
    //  *************************  // 


    else if(msgText.includes("สวัสดี mysleepless") === true || msgText === "ฉันทำเสร็จเเล้ว!!")
    {
      const setMenuSelect = msgText.split(" ")  
      // console.log("1. Intervention ===> ", setMenuSelect)
      const menuSelect = setMenuSelect[2] 
      // console.log("2. Intervention ===> ", menuSelect)
      const setDate = new Date();
      const isDate = setDate.getFullYear()+"/"+(setDate.getMonth() + 1)+"/"+setDate.getDate()+" "+(setDate.getHours()+7)+":" + setDate.getMinutes()+":"+setDate.getSeconds()
      // console.log("isDate chatStatus ===> ", isDate)

      if(msgText.includes("สวัสดี mysleepless") === true)
      {
        const checkingData = datastore
        .createQuery("user_runninig_menu")
        .filter('userid', '=', userID)
        .order('id_log',{
            descending: true
          })
        .limit(1)

        const [tasks] = await datastore.runQuery(checkingData)
        /// savoring ///
        if(menuSelect === "savoring")
        {

          // console.log("3. Intervention ===> ", tasks)
          // console.log("3.1. Intervention ===> ", tasks.length)

          let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
          const logId = setLogId
          // console.log("logId ===> ", logId);
 
              // create //
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
                      key: taskKey,
                      data: {
                        id_log: logId,
                        menu_selection: menuSelect,
                        running_number: 1,
                        user_reply: msgText,
                        userid: userID,
                        status: false,
                        createdate: isDate
                      },
                    };

            await datastore.save(task)

            // console.log("3. Intervention ===> ", "save data")

            const botReply = datastore.createQuery("relaxation_msg").filter('id_log', '=', 1)
            const [msgReplyTasks]  = await datastore.runQuery(botReply)
            // console.log("4. Intervention ===> ", msgReplyTasks[0].chatmsg)
            const echo = {type: 'text', text: msgReplyTasks[0].chatmsg}
            return client.replyMessage(token, echo)
        }
        /// End savoring ///
        /// Cognitive Restructuring /// 
        else if(menuSelect.includes("cognitive") === true)
        {
          const setPattern = menuSelect.split(":");
          const pattern = parseInt(setPattern[1])

            // console.log("2.cognitive ===> ", tasks)
            // console.log("3.cognitive ===> ", tasks.length)
            
            let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
            const logId = setLogId
            // console.log("4.cognitive logId ===> ", logId);
            // create //
            
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: logId,
                menu_selection: menuSelect,
                running_number: 1,
                user_reply: msgText,
                userid: userID,
                status: false,
                createdate: isDate},
              };
          
            await datastore.save(task)
            // console.log("5.cognitive ===> ", "save data")
            const botReply = datastore.createQuery("cognitive_restructuring")
              .filter('id_log', '=', 1)
              .filter('Pattern', '=', pattern)
            
            const [msgReplyTasks]  = await datastore.runQuery(botReply)
            // console.log("6. cognitive ===> ", msgReplyTasks[0].chatmsg)
            const echo = {type: 'text', text: msgReplyTasks[0].chatmsg}
            return client.replyMessage(token, echo)
        }
        /// End Cognitive Restructuring /// 
        /// start Anxiety Model or unfinished_business ///  
        else if(menuSelect.includes("Anxiety") === true)
        {
          const setPattern = menuSelect.split(":");
          const pattern = parseInt(setPattern[1])

            // console.log("2.Anxiety ===> ", tasks)
            // console.log("3.Anxiety ===> ", tasks.length)
            
            let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
            const logId = setLogId
            // console.log("4.Anxiety logId ===> ", logId);
            // create //
            
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: logId,
                menu_selection: menuSelect,
                running_number: 1,
                user_reply: msgText,
                userid: userID,
                status: false,
                createdate: isDate},
              };
          
            await datastore.save(task)
            // console.log("5.Anxiety ===> ", "save data")
            const botReply = datastore.createQuery("unfinished_business")
              .filter('id_log', '=', 1)
              .filter('Pattern', '=', pattern)
            
            const [msgReplyTasks]  = await datastore.runQuery(botReply)
            // console.log("6. Anxiety ===> ", msgReplyTasks[0].chatmsg)
            const echo = {type: 'text', text: msgReplyTasks[0].chatmsg}
            return client.replyMessage(token, echo)
        }
        /// end Anxiety Model or unfinished_business /// 
      }
      if(msgText === "ฉันทำเสร็จเเล้ว!!")
      {
        const setDate = new Date();
        const isDate = setDate.getFullYear()+"/"+(setDate.getMonth() + 1)+"/"+setDate.getDate()+" "+(setDate.getHours()+7)+":" + setDate.getMinutes()+":"+setDate.getSeconds()

        const kind = "card_menu_select"
        const taskKey = datastore.key([kind]);
        const task = {
                key: taskKey,
                data: {
                  createDateTime: isDate,
                  menu_name: "Activities_Scheduling",
                  userid: userID
                },
              };

        await datastore.save(task)

        const msgReply = "บันทึกข้อมูลเรียบร้อยคะ ขอให้วันนี้เป็นวันที่ดีสำหรับท่านนะคะ :)"
        const echo = {type:'text', text: msgReply}
        return client.replyMessage(token, echo)
      }
      if(msgText.includes("Muscle relax") === true || msgText.includes("Music Relax") === true || msgText.includes("breathing Video") === true)
      {
        const checkingData = datastore
        .createQuery("user_runninig_menu")
        .filter('userid', '=', userID)
        .order('id_log',{
            descending: true
          })
        .limit(1)

        let setLogId = (tasks.length === 0 || tasks.length === undefined)? 0 : tasks[0].id_log  + 1
        const logId = setLogId

        const [tasks] = await datastore.runQuery(checkingData)
        const kind = "user_runninig_menu"
        const taskKey = datastore.key([kind]);
        const task = {
          key: taskKey,
          data: {
            id_log: logId,
            menu_selection: "",
            running_number: 1,
            user_reply: msgText,
            userid: userID,
            status: false,
            createdate: isDate},
          };
          
            await datastore.save(task)
      }
    }


    else
    {
      // console.log("else start to check check bot")
      const checkingData = datastore
      .createQuery("user_runninig_menu")
      .filter('userid', '=', userID)
      .order('id_log',{
        descending: true
      })
      .limit(1)

      const [tasksData]  = await datastore.runQuery(checkingData)
      const countingTask = tasksData.length 
      const chatStatus = tasksData[0].status
      const setMenu = tasksData[0].menu_selection
      let setIdCount = tasksData[0].id_log
      let menuRunning = tasksData[0].running_number
      const setDate = new Date();
      const isDate = setDate.getFullYear()+"/"+(setDate.getMonth() + 1)+"/"+setDate.getDate()+" "+(setDate.getHours()+7)+":" + setDate.getMinutes()+":"+setDate.getSeconds()

      if(countingTask === 0)
      {
        // console.log("countingTask === 0 ")
        const msgReply = {type: "text", text: "ขอโทษด้วยค่ะทางระบบเราไม่รู้จักคำดังกล่าว กรุณาใช้หน้าเมนูเพื่อเข้าสู่เนื้อหาด้วยค่ะ หรือตรวจสอบรูปแบบการส่งข้อมูลหากมีข้อสงสัยอื่นๆสามารถติดต่อได้ทางเบอร์ วิศวิน 0952512060, เวทินี 0994942426"}
        return client.replyMessage(token, msgReply)
      }
      else if(chatStatus === true)
      {
        // console.log("chatStatus === true ",chatStatus )
        const replyMsg = "สำหรับวันนี้เสร็จเรียบร้อยเเล้วค่ะหากมีคำถามหรือปัญหาใด ๆ สามารถติดต่อสอบถามได้ทาง วิศวิน 0952512060, เวทินี 0994942426"
        const echo = {type: 'text', text: replyMsg}
        return client.replyMessage(token, echo)
      }
      else if(countingTask !== 0)
      {
        console.log("countingTask !== 0 ")
        if(setMenu === "savoring")
        {
          if(menuRunning === 4)
          {
            setIdCount += 1
            menuRunning += 1
            console.log("else menuRunning === 5 ",menuRunning )
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: setIdCount,
                menu_selection: setMenu,
                running_number: 0,
                user_reply: msgText,
                userid: userID,
                status: true,
                createdate: isDate}
              }
            await datastore.save(task)
            const replyBackIntervention = datastore.createQuery("relaxation_msg")
              .filter("id_log","=", menuRunning)

            const [setTasks] = await datastore.runQuery(replyBackIntervention)
            // console.log("setTasks else ===> ",setTasks) 
            const echo = {type: 'text', text: setTasks[0].chatmsg}
            return client.replyMessage(token,echo)
          }
          else
          {
            setIdCount += 1
            menuRunning += 1
            // console.log("else menuRunning !== 4  ",menuRunning )
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: setIdCount,
                menu_selection: setMenu,
                running_number: menuRunning,
                user_reply: msgText,
                userid: userID,
                status: false,
                createdate: isDate}
              }
            await datastore.save(task)
            const replyBackIntervention = datastore.createQuery("relaxation_msg")
              .filter("id_log","=", menuRunning)

            const [setTasks] = await datastore.runQuery(replyBackIntervention)
            // console.log("setTasks else ===> ",setTasks) 
            const echo = {type: 'text', text: setTasks[0].chatmsg}
            return client.replyMessage(token,echo)
          }
        }  
        else if(setMenu.includes("cognitive") === true)
        {
          const setPattern = setMenu.split(":")
          const isPattern = parseInt(setPattern[1])
          const isMenuRunnining = menuRunning + 1
          
          const setMsg = datastore.createQuery("cognitive_restructuring")
            .filter("Pattern","=",isPattern)
            .filter("id_log", "=", isMenuRunnining)

          const [setTasks] = await datastore.runQuery(setMsg)
          const msgReplyBack = setTasks[0].chatmsg
          
          if(msgReplyBack === "ฝันดีนะคะ" ||  msgReplyBack.includes("นะคะ ฝันดีค่ะ") === true)
          {
            setIdCount += 1
            console.log("else menuRunning === ฝันดีนะคะ ",isMenuRunnining )
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: setIdCount,
                menu_selection: setMenu,
                running_number: 0,
                user_reply: msgText,
                userid: userID,
                status: true,
                createdate: isDate}
              }
            await datastore.save(task)

            const echo = {type: 'text', text: msgReplyBack}
            return client.replyMessage(token,echo)
          }
          else
          {
            setIdCount += 1
            // console.log("else menuRunning !== ฝันดีนะคะ  ",isMenuRunnining )
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: setIdCount,
                menu_selection: setMenu,
                running_number: isMenuRunnining,
                user_reply: msgText,
                userid: userID,
                status: false,
                createdate: isDate}
              }
            await datastore.save(task)

            // console.log("setTasks else ===> ",setTasks) 
            const echo = {type: 'text', text: msgReplyBack}
            return client.replyMessage(token,echo)
          }
        }
        else if(setMenu.includes("Anxiety") === true)
        {
          const setPattern = setMenu.split(":")
          const isPattern = parseInt(setPattern[1])
          const isMenuRunnining = menuRunning + 1
          
          const setMsg = datastore.createQuery("unfinished_business")
            .filter("Pattern","=",isPattern)
            .filter("id_log", "=", isMenuRunnining)

          const [setTasks] = await datastore.runQuery(setMsg)
          const msgReplyBack = setTasks[0].chatmsg
          
          if(msgReplyBack === "ฝันดีนะคะ" || msgReplyBack.includes("นะคะ ฝันดีค่ะ") === true)
          {
            setIdCount += 1
            console.log("else menuRunning === ฝันดีนะคะ ",isMenuRunnining )
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: setIdCount,
                menu_selection: setMenu,
                running_number: 0,
                user_reply: msgText,
                userid: userID,
                status: true,
                createdate: isDate}
              }
            await datastore.save(task)

            const echo = {type: 'text', text: msgReplyBack}
            return client.replyMessage(token,echo)
          }
          else
          {
            setIdCount += 1
            // console.log("else menuRunning !== ฝันดีนะคะ  ",isMenuRunnining )
            const kind = "user_runninig_menu"
            const taskKey = datastore.key([kind]);
            const task = {
              key: taskKey,
              data: {
                id_log: setIdCount,
                menu_selection: setMenu,
                running_number: isMenuRunnining,
                user_reply: msgText,
                userid: userID,
                status: false,
                createdate: isDate}
              }
            await datastore.save(task)

            // console.log("setTasks else ===> ",setTasks) 
            const echo = {type: 'text', text: msgReplyBack}
            return client.replyMessage(token,echo)
          }
        }
        else if(setMenu.includes("Muscle relax") === true || setMenu.includes("Music Relax") === true || setMenu.includes("breathing Video") === true)
        {
          setIdCount += 1
          const isMenuRunnining = menuRunning + 1

          const kind = "user_runninig_menu"
          const taskKey = datastore.key([kind]);
          const task = {
            key: taskKey,
            data: {
              id_log: setIdCount,
              menu_selection: setMenu,
              running_number: isMenuRunnining,
              user_reply: msgText,
              userid: userID,
              status: true,
              createdate: isDate}
            }
          
            await datastore.save(task)
            const echo = {type: 'text', text: "เราได้รับข้อมูลเเล้วค่ะ การเข้านอนเป็นอีกเรื่องหนึ่งที่เราทำได้เลย ณ ขณะนี้  ผ่อนคลายแล้วหลับตาลง นอนใต้ผ้าห่มอุ่นๆ นะคะ ฝันดีค่ะ"}
            return client.replyMessage(token,echo)
        }
      }
      
    }

//  *************************  // 
// ************ END ************  // 
//  *************************  // 
  }

  else if (msgType === "video") {
    console.log("video path");
    const trackBackMsg = getVideo(msgID, config.channelAccessToken, userID);

    if (trackBackMsg === "Error") {
      const echo = { type: 'text', text: trackBackMsg }
      return client.replyMessage(token, echo);
    } else {
      const echo = { type: 'text', text: "บันทึกเรียบร้อยค่ะ" }
      return client.replyMessage(token, echo);
    }
    
  }else if(msgType === "image" || msgType === "Image" || msgType === "images" || msgType === "Images" || msgType === "picture" || msgType === "Picture"){
    const msgReply = {type: "text", text: "ขออภัยนะคะ ตอนนี้ระบบยังไม่สามารถรองรับรูปภาพได้  รบกวนใช้ฟังก์ชั่นการอัด video เพื่อบันทึก Thinking Log ค่ะ"}
    return client.replyMessage(token, msgReply)
  }

});

// ********************************* //
// ********* triggerActive ********* // 
// ********************************* //

// production //
///// mysleeplezz /////  21.30 1 = 07.00 , 2=13.00  
// Uc6604bf4f9659750e0caec4dd9776ca6 //
app.get('/jobs/mysleeplezz01/1', async (req, res) => {  
  const userToken = "Uc6604bf4f9659750e0caec4dd9776ca6"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  console.log("push msg to ", userToken)
  res.send("OK")
})
app.get('/jobs/mysleeplezz01/2', async (req, res) => {
  const userToken = "Uc6604bf4f9659750e0caec4dd9776ca6"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz01/3', async (req, res) => {
  const userToken = "Uc6604bf4f9659750e0caec4dd9776ca6"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz /////  22.00 1 = 06.30 , 2=13.00
// U1fc2587db1fedf8059e7af38886c6768 //
app.get('/jobs/mysleeplezz02/1', async (req, res) => {
  const userToken = "U1fc2587db1fedf8059e7af38886c6768"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz02/2', async (req, res) => {
  const userToken = "U1fc2587db1fedf8059e7af38886c6768"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz02/3', async (req, res) => {
  const userToken = "U1fc2587db1fedf8059e7af38886c6768"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz /////  22.30 23.00 1=07.30 , 2=13.00
//  Ud5cfd4fd0279342c7764eee428947453  //
app.get('/jobs/mysleeplezz03/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "Ud5cfd4fd0279342c7764eee428947453"
  if(randNum === 0)
  {
    const msgPush = anxietyModelPattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = anxietyModelPattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = anxietyModelPattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz03/2', async (req, res) => {
  const userToken = "Ud5cfd4fd0279342c7764eee428947453"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz03/3', async (req, res) => {
  const userToken = "Ud5cfd4fd0279342c7764eee428947453"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz03/4', async (req, res) => {
  const userToken = "Ud5cfd4fd0279342c7764eee428947453"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 


///// mysleeplezz ///// 
app.get('/jobs/mysleeplezz04/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U0beb0ecbd2d0a2951f76dbaf629f0ecc"
  if(randNum === 0)
  {
    const msgPush = anxietyModelPattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = anxietyModelPattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = anxietyModelPattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz04/2', async (req, res) => {
  const userToken = "U0beb0ecbd2d0a2951f76dbaf629f0ecc"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz04/3', async (req, res) => {
  const userToken = "U0beb0ecbd2d0a2951f76dbaf629f0ecc"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz04/4', async (req, res) => {
  const userToken = "U0beb0ecbd2d0a2951f76dbaf629f0ecc"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})


///// mysleeplezz ///// 


///// mysleeplezz ///// 
// U84ec9a53698518ed84ac3c598c725c5f // 
app.get('/jobs/mysleeplezz07/1', async (req, res) => {
  const userToken = "U84ec9a53698518ed84ac3c598c725c5f"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz07/2', async (req, res) => {
  const userToken = "U84ec9a53698518ed84ac3c598c725c5f"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz07/3', async (req, res) => {
  const userToken = "U84ec9a53698518ed84ac3c598c725c5f"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// 
//  Ud67028a74ad259f7af0b627ac21ba793 //   
app.get('/jobs/mysleeplezz08/1', async (req, res) => {
  const userToken = "Ud67028a74ad259f7af0b627ac21ba793"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  console.log("push msg to ", userToken)
  res.send("OK")
})
app.get('/jobs/mysleeplezz08/2', async (req, res) => {
  const userToken = "Ud67028a74ad259f7af0b627ac21ba793"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz08/3', async (req, res) => {
  const userToken = "Ud67028a74ad259f7af0b627ac21ba793"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// 
// //
app.get('/jobs/mysleeplezz09/1', async (req, res) => {
  const userToken = "U47b6099ed8408297f2070a3cfc3fb3db"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz09/2', async (req, res) => {
  const userToken = "U47b6099ed8408297f2070a3cfc3fb3db"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz09/3', async (req, res) => {
  const userToken = "U47b6099ed8408297f2070a3cfc3fb3db"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// 
// U3b00d41609c9fb52e543d450de386373 //
app.get('/jobs/mysleeplezz11/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U3b00d41609c9fb52e543d450de386373"
  if(randNum === 0)
  {
    const msgPush = anxietyModelPattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = anxietyModelPattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = anxietyModelPattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz11/2', async (req, res) => {
  const userToken = "U3b00d41609c9fb52e543d450de386373"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz11/3', async (req, res) => {
  const userToken = "U3b00d41609c9fb52e543d450de386373"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz11/4', async (req, res) => {
  const userToken = "U3b00d41609c9fb52e543d450de386373"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// 
app.get('/jobs/mysleeplezz12/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "Uf5d2750cd6074cadb875a16d42a4b391"
  if(randNum === 0)
  {
    const msgPush = anxietyModelPattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = anxietyModelPattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = anxietyModelPattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz12/2', async (req, res) => {
  const userToken = "Uf5d2750cd6074cadb875a16d42a4b391"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz12/3', async (req, res) => {
  const userToken = "Uf5d2750cd6074cadb875a16d42a4b391"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz12/4', async (req, res) => {
  const userToken = "Uf5d2750cd6074cadb875a16d42a4b391"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// Ub45121a255e0c55c641c4c320f3bb68c
app.get('/jobs/mysleeplezz14/1', async (req, res) => {
  const userToken = "Ub45121a255e0c55c641c4c320f3bb68c"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  console.log("push msg to ", userToken)
  res.send("OK")
})
app.get('/jobs/mysleeplezz14/2', async (req, res) => {
  const userToken = "Ub45121a255e0c55c641c4c320f3bb68c"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz14/3', async (req, res) => {
  const userToken = "Ub45121a255e0c55c641c4c320f3bb68c"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 


///// mysleeplezz ///// Ub4ce8f3d505f73a3aad1b1ee99130404
app.get('/jobs/mysleeplezz15/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "Ub4ce8f3d505f73a3aad1b1ee99130404"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz15/2', async (req, res) => {
  const userToken = "Ub4ce8f3d505f73a3aad1b1ee99130404"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz15/3', async (req, res) => {
  const userToken = "Ub4ce8f3d505f73a3aad1b1ee99130404"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz15/4', async (req, res) => {
  const userToken = "Ub4ce8f3d505f73a3aad1b1ee99130404"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// U46a233d655310067e87cfdd98ef16d6e
app.get('/jobs/mysleeplezz16/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U46a233d655310067e87cfdd98ef16d6e"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz16/2', async (req, res) => {
  const userToken = "U46a233d655310067e87cfdd98ef16d6e"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz16/3', async (req, res) => {
  const userToken = "U46a233d655310067e87cfdd98ef16d6e"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz16/4', async (req, res) => {
  const userToken = "U46a233d655310067e87cfdd98ef16d6e"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 


///// mysleeplezz ///// U31c6bdae5eeb3be87053099deedb0436
app.get('/jobs/mysleeplezz18/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U31c6bdae5eeb3be87053099deedb0436"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz18/2', async (req, res) => {
  const userToken = "U31c6bdae5eeb3be87053099deedb0436"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz18/3', async (req, res) => {
  const userToken = "U31c6bdae5eeb3be87053099deedb0436"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz18/4', async (req, res) => {
  const userToken = "U31c6bdae5eeb3be87053099deedb0436"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 


///// mysleeplezz ///// 

// app.get('/jobs/mysleeplezz21/1', async (req, res) => {
//   const userToken = "U53f1ae5ad9b8f120c01490dc32ff1052"
//   const msgPush = {
//     type: "template",
//     altText: "เเจ้งเตือน Intervention ค่ะ",
//     template: relaxationTwo()
//   }
//   client.pushMessage(userToken, msgPush)
//   res.send("OK")
// })
// app.get('/jobs/mysleeplezz21/2', async (req, res) => {
//   const userToken = "U53f1ae5ad9b8f120c01490dc32ff1052"
//   const msgReply = activitiesScgedulingFunc()
//   const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
//   client.pushMessage(userToken, echo);
//   res.send("OK")
// })
// app.get('/jobs/mysleeplezz21/3', async (req, res) => {
//   const userToken = "U53f1ae5ad9b8f120c01490dc32ff1052"
//   const msgReply = activitiesSchedulingTwo()
//   const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
//   client.pushMessage(userToken, echo);
//   res.send("OK")
// })

///// end mysleeplezz ///// 

///// mysleeplezz ///// U4119c1f79108bf8e66f9085d6d53ebc2
app.get('/jobs/mysleeplezz22/1', async (req, res) => {
  const userToken = "U4119c1f79108bf8e66f9085d6d53ebc2"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz22/2', async (req, res) => {
  const userToken = "U4119c1f79108bf8e66f9085d6d53ebc2"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz22/3', async (req, res) => {
  const userToken = "U4119c1f79108bf8e66f9085d6d53ebc2"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 


///// mysleeplezz ///// U108ab6f709ac68726e233d6c42317299
app.get('/jobs/mysleeplezz23/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U108ab6f709ac68726e233d6c42317299"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz23/2', async (req, res) => {
  const userToken = "U108ab6f709ac68726e233d6c42317299"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz23/3', async (req, res) => {
  const userToken = "U108ab6f709ac68726e233d6c42317299"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz23/4', async (req, res) => {
  const userToken = "U108ab6f709ac68726e233d6c42317299"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// Ufacd5b50e912cd84aba9628fde69f58a
app.get('/jobs/mysleeplezz25/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "Ufacd5b50e912cd84aba9628fde69f58a"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz25/2', async (req, res) => {
  const userToken = "Ufacd5b50e912cd84aba9628fde69f58a"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz25/3', async (req, res) => {
  const userToken = "Ufacd5b50e912cd84aba9628fde69f58a"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz25/4', async (req, res) => {
  const userToken = "Ufacd5b50e912cd84aba9628fde69f58a"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz /////  Udcc650d055214b78a1bfdc4d7a198fc8
app.get('/jobs/mysleeplezz26/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "Udcc650d055214b78a1bfdc4d7a198fc8"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz26/2', async (req, res) => {
  const userToken = "Udcc650d055214b78a1bfdc4d7a198fc8"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz26/3', async (req, res) => {
  const userToken = "Udcc650d055214b78a1bfdc4d7a198fc8"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz26/4', async (req, res) => {
  const userToken = "Udcc650d055214b78a1bfdc4d7a198fc8"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz /////  U3f2d23d0355119654b49741c6297d7e5
app.get('/jobs/mysleeplezz29/1', async (req, res) => {
  const userToken = "U3f2d23d0355119654b49741c6297d7e5"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxation()
  } 
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz ///// 
app.get('/jobs/mysleeplezz31/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U4551e58d8b384c3b5129281927ee970a"
  if(randNum === 0)
  {
    const msgPush = anxietyModelPattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = anxietyModelPattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = anxietyModelPattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz31/2', async (req, res) => {
  const userToken = "U4551e58d8b384c3b5129281927ee970a"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz31/3', async (req, res) => {
  const userToken = "U4551e58d8b384c3b5129281927ee970a"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz31/4', async (req, res) => {
  const userToken = "U4551e58d8b384c3b5129281927ee970a"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// mysleeplezz ///// 

///// mysleeplezz32 ///// 
app.get('/jobs/mysleeplezz32/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "Ub4ce4ff562a58ef44876ae6aa1ca6a00"
  if(randNum === 0)
  {
    const msgPush = anxietyModelPattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = anxietyModelPattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = anxietyModelPattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz32/2', async (req, res) => {
  const userToken = "Ub4ce4ff562a58ef44876ae6aa1ca6a00"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz32/3', async (req, res) => {
  const userToken = "Ub4ce4ff562a58ef44876ae6aa1ca6a00"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz32/4', async (req, res) => {
  const userToken = "Ub4ce4ff562a58ef44876ae6aa1ca6a00"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// end mysleeplezz32 ///// 

///// mysleeplezz33 ///// 
app.get('/jobs/mysleeplezz33/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U2dbc1e671a33e8a5cabe0924be03c073"
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz33/2', async (req, res) => {
  const userToken = "U2dbc1e671a33e8a5cabe0924be03c073"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz33/3', async (req, res) => {
  const userToken = "U2dbc1e671a33e8a5cabe0924be03c073"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz33/4', async (req, res) => {
  const userToken = "U2dbc1e671a33e8a5cabe0924be03c073"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// end mysleeplezz33 ///// 

///// mysleeplezz34 ///// 
app.get('/jobs/mysleeplezz34/1', async (req, res) => {
  const randNum = parseInt(Math.random() * 3);
  const userToken = "U464e7ff02d83e76ecd3fb3081d21343d  "
  if(randNum === 0)
  {
    const msgPush = cognitivePattern1()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum === 1)
  {
    const msgPush = cognitivePattern2()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
  else if(randNum  === 2)
  {
    const msgPush = cognitivePattern3()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userToken,echo)
    res.send("OK")
  }
})
app.get('/jobs/mysleeplezz34/2', async (req, res) => {
  const userToken = "U464e7ff02d83e76ecd3fb3081d21343d"
  const msgPush = {
    type: "template",
    altText: "เเจ้งเตือน Intervention ค่ะ",
    template: relaxationTwo()
  }
  client.pushMessage(userToken, msgPush)
  res.send("OK")
})
app.get('/jobs/mysleeplezz34/3', async (req, res) => {
  const userToken = "U464e7ff02d83e76ecd3fb3081d21343d"
  const msgReply = activitiesScgedulingFunc()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
app.get('/jobs/mysleeplezz34/4', async (req, res) => {
  const userToken = "U464e7ff02d83e76ecd3fb3081d21343d"
  const msgReply = activitiesSchedulingTwo()
  const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgReply}
  client.pushMessage(userToken, echo);
  res.send("OK")
})
///// end mysleeplezz34 ///// 
// end production // 

 

/// ***************  ***************//
//  *** ***** start trigger *** **  // 
/// ***************  ***************//

app.get("/jobs/timimg/21/00", async (req, res) => {
  const setFlex = notificationMoodActivity()
  const setUserToken = ['Ub4ce8f3d505f73a3aad1b1ee99130404','U31c6bdae5eeb3be87053099deedb0436', ]
  const setMsg = {type: 'flex', altText: 'เเจ้งเตือน mood log เเละ Activity log ค่ะ', contents: setFlex}
  client.multicast(setUserToken, setMsg)
  res.send("ok")
})

app.get("/jobs/timimg/21/30", async (req, res) => {
  const setFlex = notificationMoodActivity()
  const setUserToken = ['Uc6604bf4f9659750e0caec4dd9776ca6']
  const setMsg = {type: 'flex', altText: 'เเจ้งเตือน mood log เเละ Activity log ค่ะ', contents: setFlex}
  client.multicast(setUserToken, setMsg)
  res.send("ok")
})


app.get("/jobs/timimg/22/00", async (req, res) => {
  const setFlex = notificationMoodActivity()
  const setUserToeken = ['U1fc2587db1fedf8059e7af38886c6768', 
  'U84ec9a53698518ed84ac3c598c725c5f',
  'U46a233d655310067e87cfdd98ef16d6e',
  'Ufacd5b50e912cd84aba9628fde69f58a'
  ]
  const setMsg = {type: 'flex', altText: 'เเจ้งเตือน mood log เเละ Activity log ค่ะ', contents: setFlex}
  client.multicast(setUserToeken, setMsg)
  res.send("ok")
})


app.get("/jobs/timimg/22/30", async (req, res) => {
  const setFlex = notificationMoodActivity()
  const setUserToken = ['Ud5cfd4fd0279342c7764eee428947453','Ud67028a74ad259f7af0b627ac21ba793','U4551e58d8b384c3b5129281927ee970a','U47b6099ed8408297f2070a3cfc3fb3db']
  const setMsg = {type: 'flex', altText: 'เเจ้งเตือน mood log เเละ Activity log ค่ะ', contents: setFlex}
  client.multicast(setUserToken, setMsg)
  res.send("ok")
})


app.get("/jobs/timimg/23/00", async (req, res) => {
  const setFlex = notificationMoodActivity()
  const setUserToken = ['U0beb0ecbd2d0a2951f76dbaf629f0ecc','U3b00d41609c9fb52e543d450de386373','Ub45121a255e0c55c641c4c320f3bb68c','U4119c1f79108bf8e66f9085d6d53ebc2','U108ab6f709ac68726e233d6c42317299','Udcc650d055214b78a1bfdc4d7a198fc8', 'U3f2d23d0355119654b49741c6297d7e5', 'U2dbc1e671a33e8a5cabe0924be03c073','U464e7ff02d83e76ecd3fb3081d21343d']
  const setMsg = {type: 'flex', altText: 'เเจ้งเตือน mood log เเละ Activity log ค่ะ', contents: setFlex}
  client.multicast(setUserToken, setMsg)
  res.send("ok")
})

app.get("/jobs/timimg/23/30", async (req, res) => {
  const setFlex = notificationMoodActivity()
  const setUserToken = ['Ub4ce4ff562a58ef44876ae6aa1ca6a00','Uf5d2750cd6074cadb875a16d42a4b391']
  const setMsg = {type: 'flex', altText: 'เเจ้งเตือน mood log เเละ Activity log ค่ะ', contents: setFlex}
  client.multicast(setUserToken, setMsg)
  res.send("ok")
})


/// ***************  ***************//
//  *** ***** end trigger *** ****  // 
/// ***************  ***************//

// U51fca2ec938022c69e9b151cef5edf35  Earth
// Ub4ce4ff562a58ef44876ae6aa1ca6a00  peak
// U4551e58d8b384c3b5129281927ee970a  proud
// U8fca26b624ea91100255bd2121537e50  furt 
// U2dbc1e671a33e8a5cabe0924be03c073  ploy
 // U464e7ff02d83e76ecd3fb3081d21343d tiger

app.get('/test/inter/:menu/:userid/:pattern', (req, res) => {
  const pattern = parseInt(req.params.pattern);
  const userid = req.params.userid
  const setMenu = parseInt(req.params.menu)
  if(setMenu === 0)
  {
    const msgPush = {
      type: "template",
      altText: "เเจ้งเตือน Intervention ค่ะ",
      template: relaxation()
    }

    client.pushMessage(userid, msgPush)
    console.log("push msg to ", userid, pattern)
    res.send("OK")
  }
  else if(setMenu === 1)
  {
    if(pattern === 1)
    {
      const msgPush = cognitivePattern1()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok cognitivePattern1")
      res.send("OK")
    }
    else if(pattern === 2)
    {
      const msgPush = cognitivePattern2()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok cognitivePattern1")
      res.send("OK")
    }
    else if(pattern === 3)
    {
      const msgPush = cognitivePattern3()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok cognitivePattern1")
      res.send("OK")
    }
  }
  else if(setMenu === 2)
  {
    if(pattern === 1)
    {
      const msgPush = anxietyModelPattern1()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok anxietyModelPattern1")
      res.send("OK")
    }
    else if(pattern === 2)
    {
      const msgPush = anxietyModelPattern2()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok anxietyModelPattern1")
      res.send("OK")
    }
    else if(pattern === 3)
    {
      const msgPush = anxietyModelPattern3()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok anxietyModelPattern1")
      res.send("OK")
    }
  }
  else if(setMenu === 4)
  {
      const msgPush = activitiesSchedulingTwo()
      const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
      client.pushMessage(userid,echo)
      console.log("push ok activitiesScgedulingFunc")
      res.send("OK")
  }
  else if(setMenu === 5)
  {
    const msgPush = activitiesScgedulingFunc()
    const echo = {type: 'flex', altText: 'เเจ้งเตือน Intervention ค่ะ', contents: msgPush}
    client.pushMessage(userid,echo)
    console.log("push ok activitiesScgedulingFunc")
    res.send("OK")
  }
  else if(setMenu ===6)
  {
    const msgPush = {
      type: "template",
      altText: "relaxation",
      template: relaxationTwo()
    }

    client.pushMessage(userid, msgPush)
    console.log("push ok relaxationTwo")
    res.send("OK")
  }
  else if(setMenu ===7)
  {
    const imageSend = {
      type: "image",
      originalContentUrl: "https://i.ibb.co/ryHgFz4/Q1.png",
      previewImageUrl: "https://i.ibb.co/ryHgFz4/Q1.png"
    }
    client.pushMessage(userid, imageSend)
    res.send("ok")
  }
  else if(setMenu ===8)
  {
    const userToken = [
      'U51fca2ec938022c69e9b151cef5edf35',
      'U2dbc1e671a33e8a5cabe0924be03c073',
    ]
    const imageSend = {
      type: "image",
      originalContentUrl: "https://i.ibb.co/jwgYcDs/Q2.png",
      previewImageUrl: "https://i.ibb.co/jwgYcDs/Q2.png"
    }
  
    client.multicast(userToken, imageSend)
    res.send("ok")
  }
  else if(setMenu === 9)
  {
    const setFlex = notificationMoodActivity()
    const setUserToken = ['U51fca2ec938022c69e9b151cef5edf35','U8fca26b624ea91100255bd2121537e50','U2dbc1e671a33e8a5cabe0924be03c073','U464e7ff02d83e76ecd3fb3081d21343d']
    const setMsg = {type: 'flex', altText: 'this is a Flex Message', contents: setFlex}
    client.multicast(setUserToken, setMsg)
    res.send('ok')
  }
})


// ******************************** //
// ********* End trigger ********* //
// ******************************** //

// ******************************** //
//  ********* once trigger ********* // 
// ******************************** //

// q1 //   U4551e58d8b384c3b5129281927ee970a
app.get("/once/q1", (req, res)=>{
  const userToken = "U51fca2ec938022c69e9b151cef5edf35"
  const imageSend = {
    type: "image",
    originalContentUrl: "https://i.ibb.co/ryHgFz4/Q1.png",
    previewImageUrl: "https://i.ibb.co/ryHgFz4/Q1.png"
  }
  client.pushMessage(userToken, imageSend)
  res.send("ok")
})

// q2 //
app.get("/once/q2", (req, res)=>{
  const userToken = [
    // 'U4119c1f79108bf8e66f9085d6d53ebc2',
    // 'Uc6604bf4f9659750e0caec4dd9776ca6',
    // 'U1fc2587db1fedf8059e7af38886c6768',
    // 'Ud67028a74ad259f7af0b627ac21ba793',
    // 'U84ec9a53698518ed84ac3c598c725c5f',
    // 'Ub45121a255e0c55c641c4c320f3bb68c',
    // 'U47b6099ed8408297f2070a3cfc3fb3db',
    'U51fca2ec938022c69e9b151cef5edf35'
  ]
  const imageSend = {
    type: "image",
    originalContentUrl: "https://i.ibb.co/jwgYcDs/Q2.png",
    previewImageUrl: "https://i.ibb.co/jwgYcDs/Q2.png"
  }

  client.multicast(userToken, imageSend)
  res.send("ok")
})

// q3 //
app.get("/once/q3", (req, res)=>{
  const userToken = [
    // 'Ub4ce8f3d505f73a3aad1b1ee99130404',
    // 'Udcc650d055214b78a1bfdc4d7a198fc8',
    // 'Ufacd5b50e912cd84aba9628fde69f58a',
    // 'U46a233d655310067e87cfdd98ef16d6e',
    // 'U464e7ff02d83e76ecd3fb3081d21343d',
    // 'U31c6bdae5eeb3be87053099deedb0436',
    // 'U108ab6f709ac68726e233d6c42317299',
    'U2dbc1e671a33e8a5cabe0924be03c073',
    'U51fca2ec938022c69e9b151cef5edf35'
  ]
  const imageSend = {
    type: "image",
    originalContentUrl: "https://i.ibb.co/QjcDwQ0/Q3.png",
    previewImageUrl: "https://i.ibb.co/QjcDwQ0/Q3.png"
  }

  client.multicast(userToken, imageSend)
  res.send("ok")
})

// q4 //
app.get("/once/q4", (req, res)=>{
  const userToken = [
    // 'U3b00d41609c9fb52e543d450de386373',
    // 'U4551e58d8b384c3b5129281927ee970a',
    // 'Ud5cfd4fd0279342c7764eee428947453',
    // 'Ub4ce4ff562a58ef44876ae6aa1ca6a00',
    // 'Uf5d2750cd6074cadb875a16d42a4b391',
    'U0beb0ecbd2d0a2951f76dbaf629f0ecc',
    'U51fca2ec938022c69e9b151cef5edf35'
  ]
  const imageSend = {
    type: "image",
    originalContentUrl: "https://i.ibb.co/pryLhdN/Q4.png",
    previewImageUrl: "https://i.ibb.co/pryLhdN/Q4.png"
  }

  client.multicast(userToken, imageSend)
  res.send("ok")
})



// ******************************** //
//  ********* end trigger ********* // 
// ******************************** //


// get video //
function getVideo(id, channelAccessToken, users) {

 
    let url = 'https://api-data.line.me/v2/bot/message/' + id + '/content';

    const genDate = new Date();
    const genFileName = `${genDate.getDate()}-${genDate.getMonth()}-${genDate.getFullYear()}--${users}.mp4`
    const blob = bucket.file(genFileName)
  
      try{
        fetch(url, {
          'headers': {
            'Authorization': 'Bearer ' + channelAccessToken,
          },
          'method': 'get',
        }).then(res =>{
          new Promise((resolve, reject)=>{
            res.body.pipe(blob.createWriteStream({
              resumable:true,
            })).on('finish', ()=>{
              const publicUrl = format(`https://storage.googleapis.com/storage/browser/${bucket.name}/${blob.name}`);
              res.status(200).send(publicUrl)
            });
          })
        })
      }catch(err){
        console.log(err.message)
        const errorMsg = "Error";
        return errorMsg;
      }
}

// add new user function // 
async function addFireStorage(userID,firstName, lastName){
  
    const kind = 'Collect_Uid';

    const taskKey = datastore.key([kind]);
    const task = {
      key: taskKey,
      data: {
        Uid: userID,
        FirstName: firstName,
        LastName: lastName
      },
    };

  await datastore.save(task);
}
 
 



app.listen(port, () => {
  console.log(`serve run at port ${port}`)
});



 


 