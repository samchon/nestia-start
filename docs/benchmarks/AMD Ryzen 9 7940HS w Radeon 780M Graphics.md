## Benchmark Report
> - CPU: AMD Ryzen 9 7940HS w/ Radeon 780M Graphics     
> - RAM: 31 GB
> - NodeJS Version: v20.10.0
> - Backend Server: 1 core / 1 thread
> - Arguments: 
>   - Count: 1,024
>   - Threads: 4
>   - Simultaneous: 32
> - Total Elapsed Time: 3,476 ms

### Total
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
Total | 4,045 | 4,007 | 24.54 | 23.46 | 1 | 136

### Endpoints
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
PATCH /bbs/articles/:section | 719 | 719 | 48.72 | 34.48 | 1 | 136
GET /bbs/articles/:section/:id | 54 | 30 | 24.7 | 7.22 | 14 | 43
PUT /bbs/articles/:section/:id | 28 | 14 | 23.25 | 8.09 | 14 | 44
POST /bbs/articles/:section | 3,244 | 3,244 | 19.19 | 16.22 | 9 | 126

### Failures
Method | Path | Count | Success
-------|------|-------|--------
GET | /bbs/articles/:section/:id | 54 | 30
PUT | /bbs/articles/:section/:id | 28 | 14