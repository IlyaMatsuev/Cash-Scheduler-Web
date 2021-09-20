/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

public with sharing class Notification {
    public String title { get; set; }
    public String content { get; set; }
    public Integer userId { get; set; }

    public Notification(String title, String content, Decimal userId) {
        this.title = title;
        this.content = content;
        this.userId = (Integer) userId;
    }
}
