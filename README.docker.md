 
It will map current dir to folder `/app` inside docker container
Start container 
```
docker run -d -v ./:/app pytorch-ubuntu
```

``` 
docker run -d -v ./:/app  -p 9090:9090 --name whisperlive-server whisperlive-pytorch-ready
```

To connect to container later :

```
docker exec -it abc12345678 /bin/bash
```
