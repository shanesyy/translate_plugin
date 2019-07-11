#!/usr/bin/env bash

docker run -itd -p 443:443 --name translate_server --network redis_default translate_plugin