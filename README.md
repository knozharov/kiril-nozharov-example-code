# kiril-nozharov-example-code

## Summary

This Node.js application automates the download of the Project Gutenberg ebooks archive, the retrieval of predefined ebooks metadata and persisting it in a PostgreSQL DB.

## Requirements

- Node.js (v12.16.2)
- PostgreSQL (v12)

## Get Started

Run `npm i -g sequelize-cli` in the terminal to install the Sequelize CLI.  
Run `npm install` in the terminal inside the root folder of the application in order to install all NPM dependencies.

The DB must be created before running the application. Please, use the following helper scripts for managing the DB:

- `init_db.sh` (creating the DB + table layout)
- `reset_db.sh` (deleting all tables (+content) from the DB)
- `drop_db.sh` (dropping the DB)

Please, use the `.env` file for configuring the application.

## Comments on the Aspects to Consider

- My solution took 32.55min to index the entire content.  
In terms of memory optimizations, I decided not to uncompress the original ZIP archive, but process it via streams instead. For this purpose I am using the ‘unzipper’ and ‘tar-stream’ NPM packages. Utilizing streaming data helps the application keep its memory footprint low during processing.  
As for optimizing the DB usage, I tried to set up the models’ associations so that inserting data populates multiple tables in one step but I couldn’t get it to run properly. Therefore, each time I insert a new ebook entry with all related data (authors, subjects, etc.), I do it in several separate operations. I use bulk insert when adding a number of entries to the same table, though.

- Based solely on DB inspection and observations during and after processing, the data seems to process correctly. A recurring error I noticed is duplicate ebook entries (title, publication date, language).
I couldn’t dedicate a lot of time to unit testing as I was rushing to complete and submit the task.

- I have added indexes (both single and composite) over the specified fields to boost query performance.

## Unit Testing

I started working on the unit tests but didn't include them as they need additional work. I could continue working on them upon request.
