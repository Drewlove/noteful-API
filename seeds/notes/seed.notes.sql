TRUNCATE TABLE notes
RESTART IDENTITY; 

INSERT INTO notes(name, folder_id, content)
VALUES
('Dogs', 1,'Corporis accusamus placeat'),
('Cats', 3, 'Eos laudantium quia'),
('Pigs', 2, 'Occaecati dignissimos'),
('Birds', 1, 'Eum culpa odit.'),
('Bears', 3, 'Distinctio dolor nihil ad iure quo tempore '),
('Horses', 2, 'Aliqu magnam ut quis quas');