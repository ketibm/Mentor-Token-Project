class Email {
  constructor(to, subject, text, html = "", attachments = []) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
    this.attachments = attachments;
  }

  isValid() {
    return this.to && this.subject && this.text;
  }

  getOptions() {
    return {
      to: this.to,
      subject: this.subject,
      text: this.text,
      html: this.html,
      attachments: this.attachments,
    };
  }
}

module.exports = Email;
