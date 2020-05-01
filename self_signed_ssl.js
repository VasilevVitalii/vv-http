//@ts-check

const os = require('os')

let key = Buffer.from([
    '-----BEGIN RSA PRIVATE KEY-----',
    'MIIEpAIBAAKCAQEAuwUfwl4QA5hTR7AuCcUUbivjkMa3yp1Cqsji0mGP/63dWCKZ',
    'QVnTxXnL33mFjywEkHDurmd71OmEsp3bKzOIKIKAtNj+WdQ3a/CPvmQiHajcs0OX',
    'WHsz8u5j63Fycaqgif73ZnJho/DS5HZym/PjlXhfM93sOhMN71ZCeUkQ47JW7TdU',
    'Rc4qX1aP3fybkeq/KkB1BcrX//DbizYTPsryv5sE95xIr37AM2tmaEz2AAC4owX9',
    'yikGXzckws65eTzW24YN4KHWphSIV/dNZ3/C+jHMy5iY3ENc0Dz/HwfhAyMwQ5kj',
    'PL+ytQHX5XF0WAuuL7efo996syCHhhRQ0zrDmQIDAQABAoIBAAQZDKUZoogxokGD',
    '3r5gDx6K36WgdQ5/e6J6XF33vUwA50SzHWCNM1K0ZH81DnQgpsjzcIdpxRDZPQsc',
    '4lyD+IvKsD9GMeyN9djroHqvfv/fX1aeOIa7zFuaVZ4nEjbjYjkj2Q/pmbIZ6MUQ',
    'w1ofcfEofg2I41Aycq+32CUIMNKMYDvnBDgdpi+auLk7iCxXnzP0+xdKEmxk9Gkr',
    '/6VoL6HPZhOJIy3Jjj0mq/ZjhDevQlc2ynnARC+8cdvcFjydIaGbTxlfik+ePC9n',
    'l605WsT6n/aHSdFmQsTkow8BabXExHOqu3FD8PPyGdm0MmCGmqVoinlHvw3f3NBH',
    'RjjNKbECgYEA35HTr13ZGupH6B3huof29k5Vw9m/i0y06FN5+W2FkEFNuzrNljax',
    'nKm6cRQHfzUMmDSjO7d2zMAeSkN01sMjhVcF9Ky99xXIyskX6FEALRiYAbpALmOB',
    'yNLjGyY2dbWGZhiLppEUsazKt2CD2abpmXY6LBf6EIt9Voz/2MPiYm8CgYEA1iYK',
    'fGoeuPMc29B153qoRybCNy9m+65aeC/RWQg1gvCRw92/844QKi+t6E3yR98DdCKY',
    'puEBCGrtyJ2qzeggwx/Ja8y7/xb5Do7pirx3B49Yu+Mgu6Q9oENXC/gFWOif9Zbg',
    'AgTqEuEp+J7ylNu+ZU0+uGRHwwCcS1UNmvzqHncCgYEAjsZ1NpArfvnRNBYpOtNr',
    'zv5V3T5pCc/R1HDC+5yK6IYb2w8BjgWdxdvKuj49T2qUgXtUJ2XR0455iZmsux5h',
    'x9y8a/YJVwstcPudbfqUrzf+k1PbewSHNLYg3Qy5SNDFZNwWCyip25Hq39MeQNhM',
    'ZHnRSqmBRCGgyK5BEbB/GbcCgYEArHKPySaPvPIRUDXrbE+KyVk91sC2VoBN3DDt',
    'jZuds+bUCv08QP4qqD4i9komi5fcKR5e/St98HBjMUU+MXf3QgoL4mJJFZ9DSmTt',
    'Tkp8M7tMgmjhiBk3gyIXK807SSBzB4rKsvWQJUnqyYn94L+f7+WnV0dxvmd0dPl1',
    '7lQyl/sCgYASwPJUiY2af6B2sYp0x9oMSX1mglcdoJfSweODPrwogz3DtTjKmsTi',
    '5/oWiXaAML/+lGW83phREDFHJBU7ehWPjRymX2T6q6peSsF8j8OiQTUkth52Tdhr',
    'uaOSv7XlQBpNNV/19hNZR7Mv8vGqk+0TqQS6hC1D9KRSI2hZxXaJnw==',
    '-----END RSA PRIVATE KEY-----'
].join(os.EOL), 'utf8')

let cert = Buffer.from([
    '-----BEGIN CERTIFICATE-----',
    'MIID0zCCArsCFHZqDuPEYvLhjfGISqsqhDNu9JQ5MA0GCSqGSIb3DQEBCwUAMIGl',
    'MQswCQYDVQQGEwJSVTEZMBcGA1UECAwQU2FpbnQtUGV0ZXJzYnVyZzEZMBcGA1UE',
    'BwwQU2FpbnQtUGV0ZXJzYnVyZzEMMAoGA1UECgwDbi9hMQwwCgYDVQQLDANuL2Ex',
    'GDAWBgNVBAMMD1ZpdGFsaWkgVmFzaWxldjEqMCgGCSqGSIb3DQEJARYbdmFzaWxl',
    'di52LnZpdGFsaWlAZ21haWwuY29tMB4XDTIwMDUwMTExMDQ0N1oXDTQ3MDkxNjEx',
    'MDQ0N1owgaUxCzAJBgNVBAYTAlJVMRkwFwYDVQQIDBBTYWludC1QZXRlcnNidXJn',
    'MRkwFwYDVQQHDBBTYWludC1QZXRlcnNidXJnMQwwCgYDVQQKDANuL2ExDDAKBgNV',
    'BAsMA24vYTEYMBYGA1UEAwwPVml0YWxpaSBWYXNpbGV2MSowKAYJKoZIhvcNAQkB',
    'Fht2YXNpbGV2LnYudml0YWxpaUBnbWFpbC5jb20wggEiMA0GCSqGSIb3DQEBAQUA',
    'A4IBDwAwggEKAoIBAQC7BR/CXhADmFNHsC4JxRRuK+OQxrfKnUKqyOLSYY//rd1Y',
    'IplBWdPFecvfeYWPLASQcO6uZ3vU6YSyndsrM4gogoC02P5Z1Ddr8I++ZCIdqNyz',
    'Q5dYezPy7mPrcXJxqqCJ/vdmcmGj8NLkdnKb8+OVeF8z3ew6Ew3vVkJ5SRDjslbt',
    'N1RFzipfVo/d/JuR6r8qQHUFytf/8NuLNhM+yvK/mwT3nEivfsAza2ZoTPYAALij',
    'Bf3KKQZfNyTCzrl5PNbbhg3godamFIhX901nf8L6MczLmJjcQ1zQPP8fB+EDIzBD',
    'mSM8v7K1AdflcXRYC64vt5+j33qzIIeGFFDTOsOZAgMBAAEwDQYJKoZIhvcNAQEL',
    'BQADggEBADWPdNK1eHUadLqXy30OImRliq/m6Sk+TOu22XtM2OTQFU0Ldhkp0JxQ',
    'DR6CfwN+w4ypSFtPCLdk+0NnCsN319lg6X0nUlHut3oqQzbwZjvQyZvZ8Ht05Ecr',
    'Pl/r1B4hGRCKX+ZDwDrM6oOzMmWGDoIcIr0JUxdmopvpbZ+NGA9kPu5c+grmdO+R',
    'rKo79nJNnQHX68+L8oOx5z65LAs2G6pcRDWBQe944MxtglwdJZPYppzSGn2GtQro',
    'lL1DcG8B6U9uqihXTlheh7glEmWb75MlwB9sCJTnKUAHNrYEbmJ2cSRCdsjp+ukE',
    'uPW82rUXKQoIhXyD81qQs2bGlbPDMw0=',
    '-----END CERTIFICATE-----'
].join(os.EOL), 'utf8')

exports.key = key
exports.cert = cert