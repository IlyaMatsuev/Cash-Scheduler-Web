image_name=$1

heroku login
heroku container:login
heroku config:set CI=true
heroku container:push "$image_name"
heroku container:release "$image_name"
heroku open
