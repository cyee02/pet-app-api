import json

app_name = json.load(open('package.json'))['name']

bucket_name = f"{app_name}-image-bucket"
login_table_name = f"{app_name}-login"
user_table_name = f"{app_name}-user"

# Write to json for api usage
aws_config = {
  "ImageBucketName": bucket_name,
  "DynamoDBLoginTable": login_table_name,
  "DynamoDBUserTable": user_table_name
}
with open('./src/aws/aws-config.json', 'w') as outfile:
  json.dump(aws_config, outfile, indent=2)

# Printing out to write parameter to cloudformation CLI
parameters = ""
for key in aws_config:
  parameters += f"{key}={aws_config[key]} "

print(f"PARAMETERS='{parameters}'; APP_NAME={app_name}")