import boto3

dynamodb_table = "Whale-annjsugevjbtpi6ic5xg3qt244-whaleprod"


def main():
    session = set_aws_session()
    print(session)
    dynamodb = session.resource("dynamodb")
    table = dynamodb.Table(dynamodb_table)
    with open("whale_ids.csv", "w") as file:
        result = table.scan()
        file.write(f"whale_ids,createdAt")
        scan_kwargs = {}
        done = False
        start_key = None
        while not done:
            if start_key:
                scan_kwargs["ExclusiveStartKey"] = start_key
            response = table.scan(**scan_kwargs)
            for entry in response["Items"]:
                id = entry["id"]
                createdAt = entry["createdAt"]
                file.write(f"\n{id},{createdAt}")
            start_key = response.get("LastEvaluatedKey", None)
            done = start_key is None
        file.close()


def set_aws_session():
    session = boto3.Session(
        aws_access_key_id="xx",
        aws_secret_access_key="xx",
        region_name="eu-central-1",
    )
    return session


if __name__ == "__main__":
    main()
