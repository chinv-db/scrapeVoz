function scrapeVoz() {
  
  //Bước 1: Khai báo Google Sheet
  //Trước tiên, tạo 1 file Google Sheet, lấy ID của file rồi paste vô đây
  //Tạo 3 sheet trong file đó, đặt tên là: scrapeResult, TopicFitered, lastResult
  //Ở Sheet TopicFitered, điền vào ô A1 đoạn này =QUERY(scrapeResult!A1:D40,"select A,B,C Order By C desc limit 10",-1)
  var fileID = "1ao4TPnTNrcTjVHMdy1YLRtTOanwW6Uf9FUw4S1yUIfs";
  
  //Bước 2: Khai báo Bot
  //Trước tiên, cần 1 webhooks của Slack, vô đây để tạo: https://my.slack.com/services/new/incoming-webhook
  var url = "https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx";
  //Sau đó, khai báo tham số bot  
  var channel = "#diem-bao";  // <-- Đây là kênh mà bot sẽ post vào, chọn kênh bạn có hoặc tạo kênh mới
  var username = "voz Điểm báo"; // <-- Chỗ này là tên bot
  var icon_url = "https://fptshop.com.vn/Uploads/Originals/2014/11/5/201411050852584324_image003(33).png"; // <-- Chỗ này là ảnh đại diện
  var textSlack = ""; // <-- Chỗ này để vậy đi

  //Lấy kết quả trang 1 và 2 của F33
  var searchResults1 = UrlFetchApp.fetch("https://forums.voz.vn/forumdisplay.php?f=33").toString();
  var searchResults2 = UrlFetchApp.fetch("https://forums.voz.vn/forumdisplay.php?f=33&order=desc&page=2").toString();
  //Ghép 2 cái vô với nhau
  var searchResults = searchResults1.concat(searchResults2); 
  
  
  //Lấy tiêu đề, comment và số comment (tiêu đề được để trong h3) trong đoạn văn bản
  var titleExp=/id="thread_title_\d*">(.*?)<\/a>/gi;
  var linkExp = /a\shref="(.*?)"\sid="thread_title_\d*">/gi;
  var commentExp = /onclick="who(\d*).*\sreturn\sfalse;">\d*<\/a>/gi;
  var stickyExp = /class="vozsticky"/gi;
  var titleResults = searchResults.match(titleExp);
  Logger.log(titleResults);
  var linkResults = searchResults.match(linkExp);
  var commentResults = searchResults.match(commentExp);
  var stickyNum = searchResults.match(stickyExp);
  
  //k là số bài được sticky
  var k = 0;
  for (var num in stickyNum) {k += num;}
  //Khai báo file dùng để ghi kết quả
    
  var sR = SpreadsheetApp.openById(fileID).getSheetByName("scrapeResult");   
  sR.getRange("A:D").clear(); //Xóa hết content cũ

  
  for(var i = 1; i <40 ; i++)
    {
      var j =  +i + +k;
      var actualTitle=titleResults[i].replace(/id="thread_title_\d*">/g, "").replace(/<\/a>/gi, "");
      var actualLink=linkResults[i].replace(/a\shref="/g, "https://forums.voz.vn/").replace(/"\sid="thread_title_\d*">/gi, "");
      var actualComment=commentResults[j].replace(/onclick="who(\d*).*\sreturn\sfalse;">/g, "").replace(/<\/a>/gi, "");
      Logger.log(actualTitle);
      sR.appendRow([actualTitle, actualLink,actualComment]);   
    }
  Utilities.sleep(10000);  

  
  var sheetActive = SpreadsheetApp.openById(fileID).getSheetByName("TopicFitered");
  //Lấy giá trị từ 1 range - getRange(startRow, startCol, numRows, numCols)
  var rangeKeys = sheetActive.getRange(1,1,10,2); 
  var listKeywords = rangeKeys.getValues();   
  var lR = SpreadsheetApp.openById(fileID).getSheetByName("lastResult");   


  for (var row = 0; row < 10; row++ ) {
      //var listKeywords[row][0]; 
      var newline = "*"+ (row + 1) + ". " +listKeywords[row][0] + "* - " + listKeywords[row][1] + "\n";
      textSlack += newline;    
      console.log(textSlack);        
      
  }
  

  
  var payload = {
     "channel" : channel,
     "username" : username,
     "icon_url" : icon_url,
     "text" : textSlack,
  }  
  sendToSlack_(url,payload)
}

function sendToSlack_(url,payload) {
   var options =  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  return UrlFetchApp.fetch(url, options)
}
