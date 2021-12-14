function relaxationTwo(){
    return{
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png",
              "imageBackgroundColor": "#FFFFFF",
              "title": "Muscle relaxation",
              "text": "มาผ่อนคลายกล้ามเนื้อกันด้วย Progressive Muscle Relaxation",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/123"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "ดำเนินการ",
                      "text": "ดำเนินการ Muscle relaxation"
                  },
                  {
                      "type": "message",
                      "label": "รายละเอียด",
                      "text": "รายละเอียด Muscle relaxation"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png",
              "imageBackgroundColor": "#000000",
              "title": "Deep-slow breathing",
              "text": "การหายใจเข้าออกลึก ๆ จะทำให้เราหลับสบายขึ้น",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "ดำเนินการ",
                      "text": "ดำเนินการ Deep slow breathing"
                  },
                  {
                      "type": "message",
                      "label": "รายละเอียด",
                      "text": "รายละเอียด Deep slow breathing"
                  }
              ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
      }
}

export default  relaxationTwo; 