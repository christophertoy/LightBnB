

INSERT INTO users (name, email, password) VALUES ('Chris Toy', 'christoy@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Phil Toy', 'ptoy@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Jim Toy', 'jt@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Nancy Toy', 'nt@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, description,thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) 
VALUES (1, 'House', 'description', 'https://picsum.photos/200/300', 'https://picsum.photos/200/300', 100, 2, 3, 4, 'Canada', '123 Fake St', 'Burnaby', 'BC', 'V6P 1L1'), 
(2, 'Apartment', 'description', 'https://picsum.photos/200/300', 'https://picsum.photos/200/300', 50, 1, 2, 1, 'Canada', '456 Fake St', 'Vancouver', 'BC', 'V7P 1L2'), 
(3, 'Cabin', 'description', 'https://picsum.photos/200/300', 'https://picsum.photos/200/300', 75, 2, 3, 4, 'Canada', '722 Fake St', 'Whistler', 'BC', 'V9P 4L1');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1, 5, 'message'), 
(2, 2, 2, 4, 'message'),
(3, 3, 3, 4, 'message');
