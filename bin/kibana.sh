docker run -d --rm --link elastic7.0:elastic-url -e "ELASTICSEARCH_HOSTS=http://elastic-url:9200" -p 5601:5601 --name kibana7.0 docker.elastic.co/kibana/kibana:7.0.0