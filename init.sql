CREATE TABLE IF NOT EXISTS public.user (
  userUid SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  email VARCHAR (355) UNIQUE NOT NULL,
  createdTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  loginTime TIMESTAMP
);

INSERT INTO public.user (username, email, password, role) 
  VALUES ('admin', 'admin', '$2a$10$r1gEj1Zbko0enyW346mzbu5FWa0VfsXmSE8h0vM4HVCT6pAvz3KLm', 'admin')
  ON CONFLICT (username) DO NOTHING;
