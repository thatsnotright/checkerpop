Basic options:

## Starting
npm i

## Testing

npm run test

## Running (using ethereal which does not relay SMTP messages)

npm run start


## Sending email via SES

SES_KEY=yourAwsKey SES_SECRET="SECRET" SES_DOMAIN="yourdomain.com" npm run start
