import { Controller } from "@nestjs/common";
import helper from "nestia-helper";

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
    /**
     * List up entire articles, but paginated and summarized.
     *
     * @param section Target section
     * @param input Pagination request info with searching and sorting options
     * @returns Paged articles witb summarization
     */
    @helper.EncryptedRoute.Patch()
    public index(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedBody() input: IBbsArticle.IRequest,
    ): Promise<IPage<IBbsArticle.ISummary>> {
        return BbsArticleProvider.index(section, input);
    }

    /**
     * Get an article with detailed info.
     *
     * @param section Target section
     * @param id Target articles id
     * @returns Detailed article info
     */
    @helper.TypedRoute.Get(":id")
    public at(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedParam("id", "uuid") id: string,
    ): Promise<IBbsArticle> {
        return BbsArticleProvider.find(section, id);
    }

    /**
     * Store a new article.
     *
     * @param section Target section
     * @param input New article info
     * @returns Newly created article info
     */
    @helper.TypedRoute.Post()
    public store(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedBody() input: IBbsArticle.IStore,
    ): Promise<IBbsArticle> {
        return BbsArticleProvider.store(section, input);
    }

    /**
     * Update article.
     *
     * When updating, this BBS system does not overwrite the content, but accumulate it.
     * Therefore, whenever an article being updated, length of {@link IBbsArticle.contents}
     * would be increased and accumulated.
     *
     * @param section Target section
     * @param id Target articles id
     * @param input Content to update
     * @returns Newly created content info
     */
    @helper.TypedRoute.Put(":id")
    public update(
        @helper.TypedParam("section", "string") section: string,
        @helper.TypedParam("id", "uuid") id: string,
        @helper.TypedBody() input: IBbsArticle.IUpdate,
    ): Promise<IBbsArticle.IContent> {
        return BbsArticleProvider.update(section, id, input);
    }
}
