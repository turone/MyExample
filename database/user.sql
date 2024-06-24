CREATE TABLE users (
  id serial PRIMARY KEY, 
  username VARCHAR (50), 
  password VARCHAR (50), 
  email VARCHAR (50), 
  CONSTRAINT username_email_notnull CHECK (
    NOT (
      (
        username IS NULL 
        OR username = ''
      ) 
      AND (
        email IS NULL 
        OR email = ''
      )
    )
  )
);