## Benchmark Report
> - CPU: AMD Ryzen 9 7940HS w/ Radeon 780M Graphics     
> - RAM: 31 GB
> - NodeJS Version: v20.10.0
> - Backend Server: 1 core / 1 thread
> - Arguments: 
>   - Count: 1,024
>   - Threads: 4
>   - Simultaneous: 32
> - Total Elapsed Time: 3,013 ms

### Total
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
Total | 4,021 | 4,021 | 21.03 | 21.15 | 1 | 125

### Endpoints
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
PATCH /bbs/articles/:section | 656 | 656 | 44.38 | 27.53 | 1 | 125
PUT /bbs/articles/:section/:id | 46 | 46 | 18.8 | 5.09 | 13 | 37
GET /bbs/articles/:section/:id | 65 | 65 | 17.92 | 4.82 | 11 | 36
POST /bbs/articles/:section | 3,254 | 3,254 | 16.41 | 16.36 | 6 | 125

### Failures
Method | Path | Count | Success
-------|------|-------|--------