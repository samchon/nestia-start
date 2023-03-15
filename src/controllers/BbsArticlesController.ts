import core from "@nestia/core";
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
    /**
     * List up entire articles, but paginated and summarized.
     *
     * @param section Target section
     * @param input Pagination request info with searching and sorting options
     * @returns Paged articles witb summarization
     */
    @core.TypedRoute.Patch()
    public index(
        @core.TypedParam("section", "string") section: string,
        @core.TypedBody() input: IBbsArticle.IRequest,
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
    @core.TypedRoute.Get(":id")
    public at(
        @core.TypedParam("section", "string") section: string,
        @core.TypedParam("id", "uuid") id: string,
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
    @core.TypedRoute.Post()
    public store(
        @core.TypedParam("section", "string") section: string,
        @core.TypedBody() input: IBbsArticle.IStore,
    ): Promise<IBbsArticle> {
        return BbsArticleProvider.store(section, input);
    }

    /**
     * Update article.
     *
     * When updating, this BBS system does not overwrite the content, but accumulate it.
     * Therefore, whenever an article being updated, length of {@link IBbsArticle.snapshots}
     * would be increased and accumulated.
     *
     * @param section Target section
     * @param id Target articles id
     * @param input Content to update
     * @returns Newly created content info
     */
    @core.TypedRoute.Put(":id")
    public update(
        @core.TypedParam("section", "string") section: string,
        @core.TypedParam("id", "uuid") id: string,
        @core.TypedBody() input: IBbsArticle.IUpdate,
    ): Promise<IBbsArticle.ISnapshot> {
        return BbsArticleProvider.update(section, id, input);
    }
}
