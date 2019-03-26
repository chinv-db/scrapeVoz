# scrapeVoz
Tạo chatbot điểm báo cho Slack: lấy nguồn bài viết từ chuyên mục điểm báo f33 của VozForums
//https://forums.voz.vn/forumdisplay.php?f=33

Chatbot này hoạt động như thế nào?
- Vào 17h tới 18h mỗi ngày, file Google Script sẽ quét trên f33 của Vozforums, lấy code html của trang 1 và trang 2
- Mỗi trang có 20 bài viết, vậy có tổng cộng 40 bài viết
- Sau đó, dùng RegEx để lọc ra: tiêu đề bài viết, link bài viết, số comment
- Rồi ghi vào 1 file Google Spreadsheet, tại sheet được đặt tên là "scrapeResult"
- Cũng tại file Spreadsheet đó, một Sheet khác tên là "TopicFitered" sẽ tự động query ra 10 bài viết có nhiều comment nhất
- file Google Script sẽ đẩy 10 bài viết này vào Slack, tại kênh đã khai báo trước

Tại sao lại query theo comment
- Đặc trưng nhất của f33 chính là comment
- Nội dung tin tức tuy rằng có thú vị, nhưng nội dung comment còn thú vị hơn

Chatbot này hoạt động trên Google Script, vì:
- Miễn phí, đỡ phải lo về chuyện VPS để chạy bot, nếu viết bằng ngôn ngữ khác.
- Google Script dễ đọc, dễ chỉnh sửa, dễ mở rộng, nhiều tài liệu tham khảo
- Có thể hẹn giờ để script tự chạy hằng ngày.
