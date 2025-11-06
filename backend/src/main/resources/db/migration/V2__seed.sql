insert into users(id,email,name) values
 ('00000000-0000-4000-8000-000000000001','demo@example.com','Demo');

insert into workspaces(id,owner_id,name) values
 ('11111111-1111-4111-8111-111111111111','00000000-0000-4000-8000-000000000001','Demo Space');

insert into themes(id,workspace_id,mode,primary_color,accent_color,radius) values
 ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','light','#3b82f6','#22c55e',10);
