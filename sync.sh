aws s3 sync ./_site s3://beststoriesonline --acl public-read  --exclude "*.swp" --exclude ".git/*"
