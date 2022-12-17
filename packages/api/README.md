# SDK for Client Developers
## Outline
[`@ORGANIZATION/PROJECT`](https://github.com/samchon/nestia-template) provides SDK (Software Development Kit) for convenience.

For the client developers who are connecting to this backend server, [`@ORGANIZATION/PROJECT`](https://github.com/samchon/nestia-template) provides not API documents like the Swagger, but provides the API interaction library, one of the typical SDK (Software Development Kit) for the convenience.

With the SDK, client developers never need to re-define the duplicated API interfaces. Just utilize the provided interfaces and asynchronous functions defined in the SDK. It would be much convenient than any other Rest API solutions.

```bash
npm install --save @ORGANIZATION/PROJECT-api
```




## Usage
Import the `@ORGANIZATION/PROJECT-api` and enjoy the auto-completion.

```typescript
import api from "@ORGINIZATION/PROJECT-api";

import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

async function main(): Promise<void>
{
    //----
    // PREPARATIONS
    //----
    // CONNECTION INFO
    const connection: api.IConnection = {
        host: "http://127.0.0.1:37001",
    };

    const article: IBbsArticle = await api.functional.bbs.articles.store(
        connection,
        "general",
        {
            writer: "Robot",
            title: "Hello, world!",
            body: "Hello, I'm test automation robot",
            format: "txt",
            files: [
                {
                    name: "logo",
                    extension: "png",
                    url: "https://somewhere.com/logo.png",
                },
            ],
            password: "1234",
        },
    );
    typia.assertEquals(stored);

    const page: IPage<IBbsArticle> = await api.functional.bbs.articles.index(
        connection,
        "general",
        {
            limit: 100,
            search: {
                writer: "Robot"
            }
        }
    );
    await typia.assertEquals(page);
}
```