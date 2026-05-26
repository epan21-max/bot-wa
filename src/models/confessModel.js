class Confess {
    constructor(id, from, to, message) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.message = message;
        this.status = 'pending';
        this.timestamp = new Date().toISOString();
        this.replies = [];
    }
    
    addReply(replyMessage, from) {
        this.replies.push({
            message: replyMessage,
            from: from,
            timestamp: new Date().toISOString()
        });
    }
    
    markAsSent() {
        this.status = 'sent';
    }
    
    markAsRead() {
        this.status = 'read';
    }
    
    toJSON() {
        return {
            id: this.id,
            from: this.from,
            to: this.to,
            message: this.message,
            status: this.status,
            timestamp: this.timestamp,
            replies: this.replies
        };
    }
}

module.exports = Confess;
