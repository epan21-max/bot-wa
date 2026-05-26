const moment = require('moment');
require('moment/locale/id');

moment.locale('id');

class Helper {
    static formatNumber(number) {
        // Format nomor WhatsApp ke format internasional
        if (number.startsWith('0')) {
            return '62' + number.slice(1);
        }
        if (number.startsWith('+')) {
            return number.slice(1);
        }
        return number;
    }
    
    static validatePhoneNumber(number) {
        const regex = /^[0-9]{10,15}$/;
        return regex.test(number.replace(/[^0-9]/g, ''));
    }
    
    static formatDate(date) {
        return moment(date).format('DD MMMM YYYY, HH:mm:ss');
    }
    
    static truncateText(text, length = 50) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = Helper;
