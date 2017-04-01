#!/bin/bash
status="";
# quote the "true"
while [ -z "$status" ];
 do
  # use $(...) to start a sub shell
  status=$(wget -q -O - http://localhost:3000/display)
  # add >> << to make extra space visible. use quotes
  echo ">>$status<<"
  echo "Sleeping for 5 sec";
  sleep 5;
done;

echo "ready";

chromium --kiosk --incognito http://localhost:3000/display/#/table
#epiphany-browser -a --profile ~/epp http://localhost:3000/display/#/table

echo "done";
