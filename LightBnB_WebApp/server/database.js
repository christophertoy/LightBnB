const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  database: 'lightbnb',
  host:'localhost',
  PORT:3000
});

pool.connect(() => {
  console.log('connected to the database');
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
  .then(res => res.rows[0]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`INSERT INTO users(name, password, email) 
  VALUES ($1, $2, $3) 
  RETURNING*;`, [user.name, user.password, user.email])
    .then(res => res.rows[0])
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);

  return pool.query(`SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.reservation_id = reservations.id
  JOIN users ON reservations.guest_id = users.id
  WHERE reservations.guest_id = $1 
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
  .then(res => res.rows)

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


  const getAllProperties = function(options, limit = 10) {
    // set up array to hold paramters
    const queryParams = [];
    
    // start query with all inform that comes before the WHERE clause
    let queryString = `SELECT properties.*, AVG(rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
    `;

    
    //   for(const item in Object.values(options))
      
    //   // check if a city has been passed in as an option, add the city to the params array and create a WHERE clause for the city

    //   if (item) {
    //     queryParams.push(`%${item}%`);
    //     queryString += `WHERE ${item} LIKE $${queryParams.length} `;
    //   } 
  // }
  
    
    // check if a city has been passed in as an option, add the city to the params array and create a WHERE clause for the city
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    } 
    // check if owner id has been pased in as an option add owner id to array and create a WHERE clause
    if (options.owner_id) {
      if (queryParams.length >= 1) {
        queryParams.push(`${options.owner_id}`);
        queryString += `AND owner_id = $${queryParams.length}`
      } else {
        queryParams.push(`${options.owner_id}`);
        queryString += `WHERE owner_id = $${queryParams.length}`;
      }
    }

    if (options.minimum_price_per_night) {
      if (queryParams.length >= 1 ) {
        queryParams.push(`${options.minimum_price_per_night}`);
        queryString += `AND cost_per_night > $${queryParams.length}`;   
      } else {
        queryParams.push(`${options.minimum_price_per_night}`);
        queryString += `WHERE cost_per_night > $${queryParams.length}`;

      }
    }

    if (options.maximum_price_per_night) {
      if (queryParams.length >= 1) {
        queryParams.push(`${options.maximum_price_per_night}`);
        queryString += `AND cost_per_night < $${queryParams.length}`;

      } else {
        queryParams.push(`${options.maximum_price_per_night}`);
        queryString += `WHERE cost_per_night < $${queryParams.length}`;
      }
    }

    queryString += 'GROUP BY properties.id\n'
    
    if (options.minimum_rating) {
        queryParams.push(`${options.minimum_rating}`);
        queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
    }

    // add any query thay comes after the WHERE clause
    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}

exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
return pool.query(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url,
  property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, 
property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
.then(res => res.rows)

}
exports.addProperty = addProperty;

// {
//   owner_id: int,
//   title: string,
//   description: string,
//   thumbnail_photo_url: string,
//   cover_photo_url: string,
//   cost_per_night: string,
//   street: string,
//   city: string,
//   province: string,
//   post_code: string,
//   country: string,
//   parking_spaces: int,
//   number_of_bathrooms: int,
//   number_of_bedrooms: int
