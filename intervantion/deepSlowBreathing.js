function deepSlowBreathing(){
    return  {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Deep-slow breathing",
              "weight": "bold",
              "align": "center",
              "contents": []
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": "https://vos.line-scdn.net/bot-designer-template-images/bot-designer-icon.png",
          "size": "full",
          "aspectRatio": "1.51:1",
          "aspectMode": "fit"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "กรุณาเลือก 1 วิธี ",
              "weight": "bold",
              "align": "center",
              "contents": []
            },
            {
              "type": "text",
              "text": ".",
              "color": "#FFFFFFFF",
              "align": "center",
              "contents": []
            },
            {
              "type": "text",
              "text": "1.Clip สาธิตบอกวิธีการทำ progressive",
              "align": "center",
              "contents": []
            },
            {
              "type": "text",
              "text": "deep slow breathing",
              "align": "center",
              "contents": []
            },
            {
              "type": "text",
              "text": ".",
              "align": "center",
              "contents": []
            },
            {
              "type": "text",
              "text": "2. เลือกเปิดเพลง 20 นาที",
              "align": "center",
              "contents": []
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "ดู Clip สาธิต",
                "text": "breathing Video"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "เลือกเพลง",
                "text": "Music Relax"
              }
            }
          ]
        }
      }
}

export default deepSlowBreathing; 