CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_id INT NOT NULL,
  place_id INT NOT NULL,
  visit_order INT NOT NULL,
  UNIQUE KEY uq_day_visit_order (day_id, visit_order),
  CONSTRAINT fk_routes_day
    FOREIGN KEY (day_id) REFERENCES days(id),
  CONSTRAINT fk_routes_place
    FOREIGN KEY (place_id) REFERENCES places(id)
);