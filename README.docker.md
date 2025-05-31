 
It will map current dir to folder `/app` inside docker container
Start container 
```
docker run -d -v ./:/app pytorch-ubuntu
```

To connect to container later :

```
docker exec -it abc12345678 /bin/bash
```
