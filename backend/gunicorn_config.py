import os

bind = "0.0.0.0:" + os.environ.get("PORT", "10000")
workers = 3
