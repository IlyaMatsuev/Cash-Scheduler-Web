app_name=$1

heroku login
heroku apps:destroy -a "$app_name"
heroku create "$app_name" --buildpack mars/create-react-app --region eu
heroku config:set CI=false
git push heroku master
heroku open
