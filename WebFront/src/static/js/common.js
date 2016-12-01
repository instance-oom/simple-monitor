var messager = {
  _parseContent: function (content) {
    if (typeof content !== 'string') {
      if (content.Message) {
        return content.Message;
      }
      if (content.Detail) {
        return content.Detail;
      }
      return JSON.stringify(content);
    }
    return content;
  },

  error: function (content) {
    content = this._parseContent(content);
    spop({
      template: content,
      position: "top-center",
      style: "error",
      autoclose: 10000
    });
  },

  success: function (content) {
    content = this._parseContent(content);
    spop({
      template: content,
      position: "top-center",
      style: "success",
      autoclose: 10000
    });
  }
}