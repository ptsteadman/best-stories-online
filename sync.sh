aws s3 sync ./_site s3://beststoriesonline.com --acl public-read  --exclude "*.swp" --exclude ".git/*"
