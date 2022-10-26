import connection from "../database/Postgres.js";

const getUsersByNamePart = ({ searchString, userId }) => {
    return connection.query(`
        SELECT users.id, users.name, "userPicture".url
        FROM users 
        JOIN "userPicture"
            ON users.id = "userPicture"."userId"
            LEFT JOIN  follows ON users.id = follows.followed AND follows.follower = $2
        WHERE users.name ILIKE $1
;`, [`${searchString}%`, userId]);
};

const getFollowByIds = ({ userId, id }) => {
    return connection.query(`
        SELECT * FROM follows WHERE follower = $1 AND followed = $2
    ;`, [userId, id]);
};

const insertNewFollower = ({ userId, id }) => {
    return connection.query(`
        INSERT INTO follows (follower, followed) VALUES ($1, $2)
    ;`, [userId, id]);
};



export { getUsersByNamePart, insertNewFollower, getFollowByIds }