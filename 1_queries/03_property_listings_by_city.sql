SELECT properties.*, AVG(rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE city = 'Vancouver'
GROUP BY properties.id
HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;