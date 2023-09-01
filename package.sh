#!/bin/bash

npm install
zimlet build
zimlet package -v 0.0.1 --zimbraXVersion ">=2.0.0" -n "zimbra-zimlet-rssfeed" --desc "Display RSS/ATOM feeds in a mail folder" -l "Zimbra RSS/ATOM Zimlet"
