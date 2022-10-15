import helper from "nestia-helper";
import { Controller } from "@nestjs/common";
import { IBbsArticle } from "../api/structures/bbs/IBbsArticle";
import { IPage } from "../api/structures/common/IPage";
import { BbsArticleProvider } from "../providers/bbs/BbsArticleProvider";

/**
 * This is a fake controller.
 *
 * Remove it or make it to be real one.
 */
@Controller("bbs/articles/:section")
export class BbsArticlesController {
    @helper.EncryptedRoute.Patch()
    public index(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedBody() input: IBbsArticle.IRequest,
    ): Promise<IPage<IBbsArticle.ISummary>> {
        return BbsArticleProvider.index(section, input);
    }

    @helper.TypedRoute.Get(":id")
    public at(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedParam("id", "uuid") id: string,
    ): Promise<IBbsArticle> {
        return BbsArticleProvider.find(section, id);
    }

    @helper.TypedRoute.Post()
    public store(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedBody() input: IBbsArticle.IStore,
    ): Promise<IBbsArticle> {
        return BbsArticleProvider.store(section, input);
    }

    @helper.TypedRoute.Put(":id")
    public update(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedParam("id", "uuid") id: string,
        @helper.TypedBody() input: IBbsArticle.IUpdate,
    ): Promise<IBbsArticle.IContent> {
        return BbsArticleProvider.update(section, id, input);
    }
}
