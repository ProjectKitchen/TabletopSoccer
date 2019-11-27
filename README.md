# Updating TabletopSoccer

The purpose of this branch is to apply necessary updates for the TabletopSoccer, in order to port the system to recent versions of nope / npm / angular / postgres-db.

## Following changes have been applied:

### Node and toolchain setup 

- used node version 12.13.1 (nvm)
- removed obsolete dependencies for testing (karma / phantomjs, ..)
- added "npm-shrinkwrap.json" file to client's and display's folders to set the version of the dev dependency graceful-fs t version 4.2.2 - this was necessary because an incompatibility of other version with the used node/gulp combinations::

   ```
   {  
   "dependencies": {  
   "graceful-fs": {  
   "version": "4.2.2"  
   }}}  
   ```


- added password and superuser priviledges for user "pi" in postgresql - 
  modified the postgres setup which is shown in the documentation as follows:

   ```
   sudo su postgres  
   createuser pi -P -s  (then input and confirm password 'raspberry')
   createdb wuzzler_db  
   psql wuzzler_db -f backend/wuzzler_db_9.1.sql  
   ```

- set iptables port forwarding of (local and remote) traffic on port 80 to port 3000:
   see: https://www.raspberrypi.org/forums/viewtopic.php?t=202434  
   This is done by the script `nat_iptables.sh` in the main folder


### Changes in the backend

- modified db-connectionstring in backend / db.js to contain password:

   `postgres://pi:raspberry@localhost/wuzzler_db`

- updated initialistaion of eureca.io server to current syntax

### Changes in client / display

- updated initialistaion of eureca.io client to correct uri in src/app/wuzzlerDataService.js

   (line 7) `var client = new Eureca.Client({ uri: 'localhost:3000', prefix: 'eureca.io', retry: 3 });`
   
- added correct eureca.js source uri from localhost in src/index.html: 

   (line 25/line 28): `<script src="http://localhost:3000/eureca.js"></script>`

- added delay in client.onConnect before eureca.server is used in client src/app/wuzzlerDataService.js: 

   (line 49): `setTimeout (function() { .... } , 500);`  
   This should be improved as it is a simple workaround 



## Playing audio from node / js:

https://www.npmjs.com/package/play-sound
(tested with .wav files on raspberryPi)


## HDMI-CEC to control TV via HDMI 

`sudo apt install cec-utils`

- Turn TV (HDMI device 0) on: `echo 'standby 0' | cec-client -s`
- Turn TV (HDMI device 0) to standby: `echo 'on 0' | cec-client -s`
- Switch HDMI Source of TV to 1,2,3:

   ```
   echo 'tx 4F:82:10:00' | cec-client -s  
   echo 'tx 4F:82:20:00' | cec-client -s  
   echo 'tx 4F:82:30:00' | cec-client -s  
   ```

  See:  
  https://www.loxwiki.eu/pages/viewpage.action?pageId=23462202  
  https://www.endpoint.com/blog/2012/11/08/using-cec-client-to-control-hdmi-devices  
  https://github.com/Pulse-Eight/libcec/issues/202  
  https://github.com/Pulse-Eight/libcec/blob/00afa793a90dc82c53ffb58622294cf9e06fe348/src/cec-client/cec-client.cpp#L317  
  https://www.whizzy.org/wp-content/uploads/2012/11/cecsimple.sh_.txt  



---



# TabletopSoccer

The UAS Technikum Wien Mensa's "Smart Wuzzler" !

by Alexander Peters (see /documentation)


Features:
* runs on RaspberryPi (HDMI display)
* wifi hotspot and client interface for game management
* user account system (postgresql database)
* backend interface to Arduino for automatic goal counting

(built with node.js, gulp/angular) 