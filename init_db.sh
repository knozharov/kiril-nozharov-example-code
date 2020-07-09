#!/bin/bash

createdb -U postgres test_task
sequelize db:migrate
