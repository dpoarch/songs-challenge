Populate this file with the steps you took to get MeiliSearch up and running!

1. Spawn a Meilisearch instance using docker (https://docs.meilisearch.com/reference/features/installation.html#download-and-launch)

```
docker run -it --rm -p 7700:7700 -v data.ms:/data.ms getmeili/meilisearch
```

2. Index song documents by running the following

```
curl -X POST "http://localhost:7700/indexes/songs/documents" -d @songs.json
```

3. Verify the instance by accessing the web-interface via: http://localhost:7700/


*note: while meilisearch will be unsecure and manually indexing via curl is impractical, we assume that this is for testing purposes only*