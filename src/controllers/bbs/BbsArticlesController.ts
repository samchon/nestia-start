import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IBbsArticle } from "../../api/structures/bbs/IBbsArticle";
import { IPage } from "../../api/structures/common/IPage";
import { BbsArticleProvider } from "../../providers/bbs/BbsArticleProvider";

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
   * This method is for listing up summarized articles with pagination.
   *
   * If you want, you can search and sort articles with specific conditions.
   *
   * @param section Target section
   * @param body Pagination request info with searching and sorting options
   * @returns Paginated articles with summarization
   */
  @core.TypedRoute.Patch()
  public index(
    @core.TypedParam("section") section: string,
    @core.TypedBody() body: IBbsArticle.IRequest,
  ): Promise<IPage<IBbsArticle.ISummary>> {
    return BbsArticleProvider.index({
      section,
      input: body,
    });
  }

  /**
   * Get an article with detailed info.
   *
   * Open an article with detailed info, increasing reading count.
   *
   * @param section Target section
   * @param id Target articles id
   * @returns Detailed article info
   */
  @core.TypedRoute.Get(":id")
  public at(
    @core.TypedParam("section") section: string,
    @core.TypedParam("id") id: string,
  ): Promise<IBbsArticle> {
    return BbsArticleProvider.find({
      section,
      id,
    });
  }

  /**
   * Create a new article.
   *
   * Create a new article and returns its detailed record info.
   *
   * @param section Target section
   * @param body New article info
   * @returns Newly created article info
   */
  @core.TypedRoute.Post()
  public create(
    @core.TypedParam("section") section: string,
    @core.TypedBody() body: IBbsArticle.ICreate,
  ): Promise<IBbsArticle> {
    return BbsArticleProvider.create({
      section,
      input: body,
    });
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
   * @param body Content to update
   * @returns Newly created content info
   */
  @core.TypedRoute.Put(":id")
  public update(
    @core.TypedParam("section") section: string,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() body: IBbsArticle.IUpdate,
  ): Promise<IBbsArticle.ISnapshot> {
    return BbsArticleProvider.update({
      section,
      id,
      input: body,
    });
  }

  /**
   * Erase an article.
   *
   * Erase an article with specific password.
   *
   * @param section Target section
   * @param id Target articles id
   * @param body Password to erase
   */
  @core.TypedRoute.Delete(":id")
  public erase(
    @core.TypedParam("section") section: string,
    @core.TypedParam("id") id: string,
    @core.TypedBody() body: IBbsArticle.IErase,
  ): Promise<void> {
    return BbsArticleProvider.erase({
      section,
      id,
      input: body,
    });
  }
}
