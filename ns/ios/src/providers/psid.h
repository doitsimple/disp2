//
//

#import <Foundation/Foundation.h>
#import "FMDatabase.h"
#import "FMResultSet.h"
#import "^^=name$$Model.h"

@interface ^^=name$$Utils : NSObject

//创建单例对象
+ (^^=name$$Utils *)sharedDatabase;

//添加对象
- (void)addItem:(^^=name$$Model *)item;
//删除对象
- (void)deleteById:(NSString *)^^=idField.name$$;
//查找所有对象
- (NSArray *)list;
//查找指定对象
- (^^=name$$Model *)getById:(NSString *)^^=idField.name$$;
//更新指定数据
- (void)upsertById:(NSString *)^^=idField.name$$ ^^=name$$Model:(^^=name$$Model *)updateItem;
@end
