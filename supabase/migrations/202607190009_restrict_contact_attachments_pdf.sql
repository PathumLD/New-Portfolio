-- Restrict contact form attachments to PDF files only.
update storage.buckets
set
  allowed_mime_types = array['application/pdf'],
  file_size_limit = 10485760
where id = 'contact-attachments';
