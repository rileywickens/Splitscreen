const db = require('./DBConnection');
const Activity = require('./models/Activity');
const User = require('./models/User');
const Game = require('./models/Game');

const VALID_STATUSES = ['playing', 'finished', 'dropped'];

const ACTIVITY_JOIN_QUERY = `
    SELECT a.*,
           u.usr_id, u.usr_first_name, u.usr_last_name, u.usr_username,
           g.gme_id, g.gme_slug, g.gme_name, g.gme_image
    FROM activity a
    JOIN user u ON a.act_usr_id = u.usr_id
    JOIN game g ON a.act_gam_id = g.gme_id
`;

const mapActivity = (row) => {
    const activity = new Activity(row);
    activity.setUser(new User(row));
    activity.setGame(new Game(row));
    return activity;
};

module.exports = {
    // POST or PUT — set status regardless of whether activity exists yet
    setActivityStatus: (userId, gameId, action) => {
        return new Promise((resolve, reject) => {
            if (!VALID_STATUSES.includes(action)) {
                reject({ code: 400, message: "Invalid status value" });
                return;
            }

            return db.query(
                `INSERT INTO activity (act_usr_id, act_gam_id, act_action)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE act_action = VALUES(act_action)`,
                [userId, gameId, action]
            ).then(result => {
                resolve(true);
            }).catch(err => {
                console.log(err);
                reject({ code: 500, message: "Database Error: " + err });
            });
        });
    },

    // PUT clear status (set to NULL)
    clearActivityStatus: (userId, gameId) => {
        return new Promise((resolve, reject) => {
            return db.query(
                `UPDATE activity SET act_action = NULL
                WHERE act_usr_id = ? AND act_gam_id = ?`,
                [userId, gameId]
            ).then(result => {
                if (result.affectedRows === 0) {
                    reject({ code: 404, message: "Activity not found" });
                    return;
                }
                resolve(true);
            }).catch(err => {
                console.log(err);
                reject({ code: 500, message: "Database Error: " + err });
            });
        });
    },

    // GET status of a specific game for a user
    getActivityByUserAndGame: (userId, gameId) => {
        return db.query(
            `SELECT * FROM activity WHERE act_usr_id = ? AND act_gam_id = ?`,
            [userId, gameId]
        ).then(rows => {
            if (!rows[0]) return null;
            return new Activity(rows[0]);
        });
    },

    // GET all activities for a user
    getActivitiesByUser: (userId) => {
        return db.query(
            `${ACTIVITY_JOIN_QUERY} WHERE a.act_usr_id = ? AND a.act_action IS NOT NULL
            ORDER BY a.act_id DESC`, [userId]
        ).then(rows => rows.map(mapActivity));
    },

    // GET recent activities by a list of user ids (for friends feed)
    getActivitiesByUsers: (userIds) => {
        if (!userIds.length) return Promise.resolve([]);
        return db.query(
            `${ACTIVITY_JOIN_QUERY} WHERE a.act_usr_id IN (?) AND a.act_action IS NOT NULL
            ORDER BY a.act_id DESC`,
            [userIds]
        ).then(rows => rows.map(mapActivity));
    },

    // GET recent activities by a list of user ids for a specific game
    getActivitiesByUsersForGame: (userIds, gameId) => {
        if (!userIds.length) return Promise.resolve([]);
        return db.query(
            `${ACTIVITY_JOIN_QUERY} WHERE a.act_usr_id IN (?) AND a.act_gam_id = ? AND a.act_action IS NOT NULL
            ORDER BY a.act_id DESC`,
            [userIds, gameId]
        ).then(rows => rows.map(mapActivity));
    },
};