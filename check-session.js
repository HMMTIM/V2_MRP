
function checkSession() {
    const userSession = localStorage.getItem('currentUser');
    if (!userSession) {
        window.location.href = 'login.html';
        return null;
    }
    
    const user = JSON.parse(userSession);
    const now = new Date().getTime();
    
    if (now - user.lastActivity > 30 * 60 * 1000) { // 30 minutos
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
        return null;
    }
    
    user.lastActivity = now;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
}

module.exports = checkSession;
