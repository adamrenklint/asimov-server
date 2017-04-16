# Benchmarks

## Environment and tests

Running **Ubuntu Server 14.04** on a virtual machine emulating a medium-sized EC2 instance with **3.8 GB RAM**. The benchmarks are done with [wrk](https://github.com/wg/wrk), comparing out-of-the box solutions for asimov-server and Nginx + PHP.

The command I run is ```wrk -c1000 -d60 http://127.0.0.1:3003```, meaning two threads of 1000 concurrent connections for 60 seconds.

## Results

### asimov-server

### Nginx + PHP

## Disclaimer

After having read a fair bit about server benchmarks, there seems to be a lot of conflict regarding this type of setup. Some people argue that one should compare serving raw files with Nginx, rather than doing server side scripting with PHP. Given that asimov-server allows for advanced request/response flows using super-charged express.js middleware, and can be used to do far more advanced stuff than just serve files, I think the following setup is fair.

To increase the performance even more, you could put Nginx in front of asimov-server and serve all or some files in your public folder directly, and avoid hitting the node.js server at all. In this scenario, you don't get to make use of the powerful pre, main and post-middleware chains. If you really don't need them, it could be a valid solution. Or just use Nginx completely.
